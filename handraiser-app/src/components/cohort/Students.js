import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import jwtToken from "../tools/assets/jwtToken";
import { UserContext } from "./CohortPage";
import HelpIcon from "@material-ui/icons/Help";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import io from "socket.io-client";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import {
  IconButton,
  ListItem,
  Typography,
  CardHeader,
  Avatar,
  Menu,
  MenuItem
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
let socket;
export default function Students({
  room_id,
  id,
  status,
  student_id,
  index,
  text,
  classes
}) {
  const userObj = jwtToken();
  const ENDPOINT = "localhost:3001";
  const [student, setStudent] = useState([]);
  const { chatHandler } = useContext(UserContext);
  const handleClose = () => setAnchorEl(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = e => setAnchorEl(e.currentTarget);
  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
  }, [ENDPOINT]);

  useEffect(() => {
    Axios({
      method: "get",
      url: `/api/users/${student_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        setStudent(res.data);
      })
      .catch(err => console.log(err));
  }, [student_id]);

  const handleUpdate = (e, value) => {
    e.preventDefault();
    const obj = {
      concern_status: value,
      mentor_id: userObj.user_id
    };
    socket.emit(
      "updateConcern",
      { id: room_id, concern_id: id, updateData: obj, userObj: userObj },
      () => {}
    );
  };
  const handleDelete = event => {
    event.stopPropagation();
    socket.emit(
      "deleteConcern",
      { id: room_id, concern_id: id, userObj: userObj },
      () => {}
    );
  };

  return (
    <ListItem
      key={index}
      className={classes.beingHelped}
      button={userObj.user_id === student_id || userObj.user_role_id === 2}
      onClick={e =>
        userObj.user_id === student_id ||
        (userObj.user_role_id === 2 &&
          status !== "pending" &&
          chatHandler(e, { room: id, concern: text, concern_status: status }))
      }
    >
      <CardHeader
        key={index}
        className={classes.cardHeaderRoot}
        style={{
          border: userObj.user_id === student_id ? "2px solid #673ab7" : "none"
        }}
        avatar={
          <Avatar
            alt={student.firstname}
            className={classes.avatar}
            src={student.avatar}
          />
        }
        action={
          <div>
            {userObj.user_role_id === 3 && status === "onprocess" ? null : (
              <IconButton aria-label="settings" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
            )}

            <Menu
              elevation={1}
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {status === "pending" && userObj.user_role_id === 2 ? (
                <div>
                  <MenuItem onClick={e => handleUpdate(e, "onprocess")}>
                    <ListItemIcon>
                      <HelpIcon />
                    </ListItemIcon>
                    <Typography variant="inherit">Help Mentee!</Typography>
                  </MenuItem>
                  <MenuItem onClick={e => handleDelete(e)}>
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <Typography variant="inherit">Remove Handraise</Typography>
                  </MenuItem>
                </div>
              ) : status === "onprocess" && userObj.user_role_id === 2 ? (
                <div>
                  <MenuItem
                    onClick={e => {
                      handleUpdate(e, "done");
                    }}
                  >
                    <ListItemIcon>
                      <CheckCircleIcon />
                    </ListItemIcon>
                    <Typography variant="inherit">Done</Typography>
                  </MenuItem>
                  <MenuItem onClick={e => handleUpdate(e, "pending")}>
                    <ListItemIcon>
                      <RemoveCircleIcon />
                    </ListItemIcon>
                    <Typography variant="inherit">
                      Send back to Need Help Queue
                    </Typography>
                  </MenuItem>
                </div>
              ) : status === "pending" &&
                userObj.user_role_id === 3 &&
                userObj.user_id === student_id ? (
                <MenuItem onClick={e => handleDelete(e)}>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <Typography variant="inherit">Remove Handraise</Typography>
                </MenuItem>
              ) : null}
            </Menu>
          </div>
        }
        title={`${text}`}
        subheader={student.firstname + " " + student.lastname}
      />
    </ListItem>
  );
}
