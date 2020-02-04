import React, { useState } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

export default function AlertDialog({
  data,
  open,
  handleClose,
  renderPending
}) {
  const [body, setBody] = useState({
    data: {
      user_approval_status_id: 3
    }
  });

  const submitUserData = e => {
    e.preventDefault();

    axios({
      method: "patch",
      url: `/api/todisapprove/${data.user_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      },
      data: body.data
    })
      .then(() => {
        handleClose();
        renderPending();
      })
      .catch(err => console.log(err));
  };

  const handleReason = e => {
    setBody({
      data: {
        ...body.data,
        [e.target.name]: e.target.value,
        user_approval_status_id: 3
      }
    });
    console.log(body);
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
      <form onSubmit={submitUserData}>
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to disapprove {data.firstname} {data.lastname}{" "}
          as a mentor?
        </DialogTitle>

        <DialogContent>
          <TextField
            id="outlined-multiline-static"
            label="Reason"
            multiline
            name="reason_disapproved"
            rows="4"
            onChange={handleReason}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button type="submit" color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
