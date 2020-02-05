import React, { useState } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";


export default function AlertDialog({ handleId, open, handleClose, renderPending }) {
  const body  = {
    data: {
        user_approval_status_id: 1
    }}
  ;


  const submitUserData = e => {
    e.preventDefault();

    axios({
      method: "patch",
      url: `/api/toapprove/${handleId.user_id}`,
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
    },
      data: body.data
    })
      .then(() => {
        handleClose();
        renderPending();
      })
      .catch(err => console.log(err));
  };
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={false}
      maxWidth="xs"
    >
        <DialogTitle id="alert-dialog-title"> Are you sure you want to assign {handleId.firstname} {handleId.lastname} as a mentor?</DialogTitle>
           
        <DialogContent>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={e => submitUserData(e)} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>

    </Dialog>
  );
}
