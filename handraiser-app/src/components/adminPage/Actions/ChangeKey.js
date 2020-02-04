import React, { useState } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";

export default function AlertDialog({ open, handleClose, renderCohorts, row }) {
  const [body, setBody] = useState({
    data: {
      class_id: row.class_id,
      class_key: row.class_key
    }
  });

  //   console.log(row)

  const submitUserData = e => {
    e.preventDefault();

    axios({
      method: "patch",
      url: `/api/class/${row.classroom_id}`,
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

  const generateKey = () => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    setBody({
      data: {
        class_id: row.class_id,
        class_key: result
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
      <form onSubmit={e => submitUserData(e)}>
        <DialogTitle id="alert-dialog-title">Change key</DialogTitle>
        id: {row.classroom_id}
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <TextField
                id="standard-basic1"
                value={body.data.class_key}
                label="Key"
                InputProps={{
                  readOnly: true
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<EditIcon />}
                onClick={generateKey}
              >
                Generate New Key
              </Button>
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
