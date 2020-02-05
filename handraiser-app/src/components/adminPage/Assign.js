import React from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";


export default function AlertDialog({ open, handleClose, renderUsers, assignObj}) {

  const submitUserData = () => {
    axios({
      method: "patch",
      url: `/api/assigning/${assignObj.id}`,
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
    },
      data: {
        user_role_id: assignObj.role,
        user_approval_status_id: 4,
        reason_disapproved: null
      }
    })
      .then(() => {
        renderUsers()
        handleClose()
      })
      .catch(err => console.log("err"));
  }
  console.log(assignObj)
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={false}
      maxWidth="xs"
    >
        <DialogTitle id="alert-dialog-title"> 
        {assignObj.role === 3
        ? `Are you sure you want to assign ${assignObj.firstname} ${assignObj.lastname} as a student?`
        : `Are you sure you want to assign ${assignObj.firstname} ${assignObj.lastname} as a mentor?`    
        }</DialogTitle>
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
