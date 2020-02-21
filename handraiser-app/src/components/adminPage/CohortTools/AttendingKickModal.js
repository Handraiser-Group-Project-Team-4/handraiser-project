import React, {useEffect} from "react";
import axios from "axios";
import io from 'socket.io-client';

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SchoolIcon from "@material-ui/icons/School";

let socket;
export default function PopupModal({ handleClose, open, data, userObj }) {
  const ENDPOINT = 'localhost:3001';

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
}, [ENDPOINT]);

  const kick = (e, userObj, row) => {
    e.preventDefault();

    row.map(x => {
      return axios({
        method: "delete",
        url: `/api/kickstud/${userObj.user_id}/${x.class_id}`,
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("accessToken")
        }
      })
        .then(res => {
          handleClose(userObj);
          socket.emit("studentKicked", { user_id: userObj.user_id, class_id: x.class_id });
          socket.emit('renderCohort')
        })
        .catch(err => console.log(err));
    });
  };
  console.log(data);
  return (
    <>
      <Dialog
        open={open}
        onClose={() => handleClose(userObj)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
   
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to kick {userObj.firstname} {userObj.lastname}{" "}
          from the following cohort:
          <List component="nav" aria-label="main mailbox folders">
            {data.map(row => (
              <ListItem key={row.class_id}>
                <ListItemIcon>
                  <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary={row.class_title} />
              </ListItem>
            ))}
          </List>
        </DialogTitle>

        <DialogContent></DialogContent>

        <DialogActions>
          <Button onClick={() => handleClose(userObj)} color="primary">
            Disagree
          </Button>

          <Button
            onClick={e => kick(e, userObj, data)}
            color="primary"
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
