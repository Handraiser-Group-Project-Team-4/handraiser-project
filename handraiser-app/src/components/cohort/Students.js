import React, { useEffect, useState, useContext } from "react";
import Axios from "axios";
import jwtToken from "../tools/jwtToken";
import { UserContext } from "./CohortPage";

import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import HelpIcon from "@material-ui/icons/Help";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import io from "socket.io-client";

let socket;
export default function Students(props) {
  const classes = useStyles();
  const userObj = jwtToken();
  const ENDPOINT = "localhost:3001";
  const { room_id, id, status, student_id, index, text } = props;
  const [student, setStudent] = useState([]);

  const { chatHandler } = useContext(UserContext);

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
        // console.log(res.data);
        setStudent(res.data);
      })
      .catch(err => console.log(err));
  }, [student_id]);

  const handleUpdate = (event, value) => {
    event.stopPropagation();
    const obj = {
      concern_status: value,
      mentor_id: userObj.user_id
    };
    socket.emit(
      "updateConcern",
      { id: room_id, concern_id: id, updateData: obj },
      () => {}
    );
  };

  const handleDelete = event => {
    event.stopPropagation();
    socket.emit("deleteConcern", { id: room_id, concern_id: id }, () => {});
  };

  return (
    <>
      <ListItem
        alignItems="flex-start"
        onClick={e => chatHandler(e, { room: id, concern: text })}
      >
        <ListItemAvatar>
          <Avatar alt={student.firstname} src={student.avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={`${student.firstname} ${student.lastname}`}
          secondary={
            <React.Fragment>
              {`Problem: ${text}`}
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
              ></Typography>
            </React.Fragment>
          }
        />
        {status === "pending" && userObj.user_role_id === 2 ? (
          <HelpIcon
            onClick={e => {
              handleUpdate(e, "onprocess");
            }}
          />
        ) : status === "onprocess" && userObj.user_role_id === 2 ? (
          <>
            <CheckCircleIcon style={{ marginLeft: 10 }} />

            <RemoveCircleIcon
              style={{ marginLeft: 10 }}
              onClick={e => {
                handleUpdate(e, "pending");
              }}
            />
          </>
        ) : status === "pending" &&
          userObj.user_role_id === 3 &&
          userObj.user_id === student_id ? (
          <DeleteIcon
            onClick={e => {
              handleDelete(e);
            }}
          />
        ) : null}
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}

const useStyles = makeStyles(theme => ({
  inline: {
    display: "inline",
    color: "#000"
  }
}));
