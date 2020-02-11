import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import io from "socket.io-client";
import { UserContext } from "./CohortPage";
import jwtToken from "../tools/assets/jwtToken";
import styled, { keyframes } from "styled-components";
import Handraise from "../../images/handraise.png";
import disabledHandraise from "../../images/disabledHandraise.png";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTheme } from "@material-ui/core/styles";

import { useMediaQuery, TextField, Button } from "@material-ui/core";
let socket;
export default function Helps() {
  const [value, setValue] = useState("");
  const [isTrue, setIsTrue] = useState(false);
  const { id, data, setData, user } = useContext(UserContext);
  const userObj = jwtToken();
  const ENDPOINT = "localhost:3001";

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(false);
  const HelpingHand = styled.div`
    background: #fff;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -ms-backface-visibility: hidden;
    backface-visibility: hidden;
    width: 330px;
    height: 330px;
    position: relative;
    margin: 0 auto;
    border-radius: 10% 30% 50% 70%;
    border: solid 15px #673ab7;
    animation: ${play} 1.5s ease infinite;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -ms-backface-visibility: hidden;
    backface-visibility: hidden;
    ${open && `animation: none; transform: scale(1.2);`}
    &:hover {
      animation: none;
      transform: scale(1.2);
      transition: 0.5s;
    }
    &:after {
      background: #fff url(${Handraise});
      background-size: 100% 100%;
      content: "";
      line-height: 305px;
      text-align: center;
      width: 300px;
      height: 300px;
      margin: 0 auto;
      position: absolute;
      border-radius: 10% 30% 50% 70%;
    }
  `;

  const handleClose = () => {
    setOpen(false);
    setValue("");
  };
  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
  }, [ENDPOINT]);

  const sendConcern = e => {
    e.preventDefault();
    const concern = {
      class_id: id,
      mentor_id: null,
      student_id: userObj.user_id,
      concern_title: value,
      concern_status: "pending"
    };
    socket.emit("sendConcern", { concern }, () => {});
    handleClose();
  };
  useEffect(() => {
    if (user) {
      let isNull = false;
      data.map(student => {
        if (user.user_id === student.student_id) {
          isNull = true;
        }
        return isNull;
      });
      setIsTrue(isNull);
    }
  });

  // const handleClick = () => {
  //   Axios({
  //     method: "post",
  //     url: `/api/concern`,
  //     data: {
  //       class_id: id,
  //       mentor_id: null,
  //       student_id: user.user_id,
  //       concern_title: value,
  //       concern_status: "pending"
  //     },
  //     headers: {
  //       Authorization: "Bearer " + sessionStorage.getItem("accessToken")
  //     }
  //   })
  //     .then(res => {
  //       setData([...data, res.data]);
  //       setValue("");
  //       setIsTrue(true);
  //     })
  //     .catch(err => console.log(err));
  // };
  return user ? (
    user.user_role_id === 3 ? (
      <>
        <HelpingHand button onClick={e => setOpen(true)} disabled={isTrue} />
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Handraiser Concern</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please type your concern below.
            </DialogContentText>
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
              style={{ width: "25vw" }}
              value={value}
              onChange={e => setValue(e.target.value)}
              // helperText={
              //   isKey.error ? "The Cohort Key you entered is invalid." : ""
              // }
              // error={isKey.error}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()} color="primary">
              Cancel
            </Button>
            <Button onClick={e => sendConcern(e)} color="primary">
              Raise Concern
            </Button>
          </DialogActions>
        </Dialog>
      </>
    ) : null
  ) : null;
}

const play = keyframes`
0% {
  transform: scale(1);
}
15% {
  box-shadow: 0 0 0 20px rgba(103, 58, 183, 0.2);
}
25% {
  box-shadow: 0 0 0 20px rgba(103, 58, 183, 0.2),
    0 0 0 40px rgba(103, 58, 183, 0.2);
}
30% {
  transform: scale(1.2);
}
50% {
  box-shadow: 0 0 0 20px rgba(103, 58, 183, 0.2),
    0 0 0 40px rgba(103, 58, 183, 0.2), 0 0 0 60px rgba(103, 58, 183, 0.2);
}
80% {
  transform: scale(1);
}`;
