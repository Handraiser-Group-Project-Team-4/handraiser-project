import React from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";

export default function UsersModal({
  fullScreen,
  open,
  title,
  data,
  handleClose,
  handleSubmit,
  type,
  buttonText,
  modalTextContent,
  setData,
  fab
}) {
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      disableBackdropClick={(type === "mentorToStudent" || type === "studentToMentor" || type === "notifyUserApprove")?true:false}
      maxWidth="sm"
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{modalTextContent}</DialogContentText>
        {type === "Enter Key" ? (
          <TextField
            autoFocus
            label="Cohort Key"
            id="outlined-full-width"
            helperText=""
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            variant="outlined"
            value={data.key}
            onChange={e => setData(e)}
            helperText={
              data.error ? "The Cohort Key you entered is invalid." : ""
            }
            error={data.error}
            required
          />
        ) : type === "Create Concern" ? (
          <TextField
            id="outlined-multiline-static"
            label="Concern"
            multiline
            rows="4"
            variant="outlined"
            helperText=""
            fullWidth
            multiline
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            style={{ width: fab ? "75vw" : "25vw" }}
            value={data}
            onChange={e => setData(e)}
          />
        ) : type === "Leave Cohort" ? (
          <TextField
            autoFocus
            label="Leave Cohort"
            id="outlined-full-width"
            helperText=""
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true
            }}
            variant="outlined"
            value={data.data}
            onChange={e => setData(e)}
            helperText={
              data.err ? "Invalid Confirmation." : ""
            }
            error={data.err}
            required
          />
        ): null}
      </DialogContent>

        <DialogActions>
          {(type === "mentorToStudent" || type === "studentToMentor" || type === "notifyUserApprove")?null:
            <Button onClick={handleClose} color="primary">
             Cancel
            </Button>
          }
       
          <Button onClick={handleSubmit} color="primary">
            {buttonText}
          </Button>
        </DialogActions>

      </Dialog>
    )
}
