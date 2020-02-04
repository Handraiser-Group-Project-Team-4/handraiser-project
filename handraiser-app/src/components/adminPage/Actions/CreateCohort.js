import React, { useState } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

export default function AlertDialog({ open, handleClose, renderCohorts }) {
  const [body, setBody] = useState({
    data: {
      class_title: "",
      class_description: ""
    }
  });

  // Handles Inputs
  const handleInputs = e => {
    let date = new Date();
    let newDate = date.toLocaleString();

    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    let key = result;

    setBody({
      data: {
        ...body.data,
        [e.target.name]: e.target.value,
        class_created: newDate,
        class_key: key,
        class_status: "t"
      }
    });
    console.log(body);
  };

  const submitUserData = e => {
    e.preventDefault();

    axios({
      method: "post",
      url: "/api/class",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      },
      data: body.data
    })
      .then(() => {
        handleClose();
        renderCohorts();
      })
      .catch(err => console.log(err));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
    >
      <form onSubmit={submitUserData}>
        <DialogTitle id="alert-dialog-title">{"Create Cohort"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="standard-basic1"
                name="class_title"
                label="title"
                onChange={handleInputs}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                id="standard-basic2"
                name="class_description"
                label="class_description"
                onChange={handleInputs}
              />
            </Grid>
          </Grid>
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
