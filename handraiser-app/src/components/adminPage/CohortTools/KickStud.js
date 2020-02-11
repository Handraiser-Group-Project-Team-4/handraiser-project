import React from "react";
import axios from "axios";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

export default function PopupModal({ handleClose, open, row }) {
  const kick = (e, row) => {
    e.preventDefault();
    // console.log(data)
    axios({
      method: "delete",
      url: `/api/kickstud/${row.user_id}/${row.class_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        handleClose(row.class_id);
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={false}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">
        Are you sure you want to kick {row.firstname} {row.lastname}
        </DialogTitle>

        <DialogContent></DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>

          <Button onClick={e => kick(e, row)} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
