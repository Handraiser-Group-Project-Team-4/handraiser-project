import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import styled, { keyframes } from "styled-components";

// COMPONENTS
import { UserContext } from "../CohortPage";
import jwtToken from "../../tools/assets/jwtToken";
import Handraise from "../../../images/handraise.png";
import UsersModal from "../../tools/UsersModal";

// Material-UI
import { useMediaQuery, useTheme, Fab } from "@material-ui/core";

let socket;
export default function Helps({ fab, classes }) {
  const [value, setValue] = useState("");
  const [isTrue, setIsTrue] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const { id, data, user } = useContext(UserContext);
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
      text-align: center;
      width: 300px;
      height: 300px;
      margin: 0 auto;
      position: absolute;
      border-radius: 10% 30% 50% 70%;
    }
  `;
  const FabHand = styled.div`
    background: #fff;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -ms-backface-visibility: hidden;
    backface-visibility: hidden;
    width: 70px;
    height: 60px;
    position: relative;
    margin: 0 auto;
    border-radius: 10% 30% 50% 70%;
    border: solid 15px #673ab7;
    animation: ${play} 10s ease infinite;
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
      text-align: center;
      width: 45px;
      height: 45px;
      left: -9px;
      top: -8px;
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

    if (value) {
      setIsEmpty(false);
      const concern = {
        class_id: id,
        mentor_id: null,
        student_id: userObj.user_id,
        concern_title: value,
        concern_status: "pending"
      };
      socket.emit("sendConcern", { concern, userObj }, () => {});
      handleClose();
    } else {
      setIsEmpty(true);
    }
  };

  useEffect(() => {
    if (user) {
      let isNull = false;
      data.map(student => {
        if (
          user.user_id === student.student_id &&
          student.concern_status !== "done"
        ) {
          isNull = true;
        }
        return isNull;
      });
      setIsTrue(isNull);
    }
  });

  return user ? (
    !isTrue && user.user_role_id === 3 ? (
      <>
        {fab ? (
          <Fab aria-label="Edit" className={classes.fab}>
            <FabHand button onClick={e => setOpen(true)} disabled={isTrue} />
          </Fab>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <HelpingHand
              button
              onClick={e => setOpen(true)}
              disabled={isTrue}
            />
            <h1
              style={{
                marginTop: "10rem",
                color: "#673ab7",
                fontweight: 400,
                fontSize: "2.5rem",
                fontFamily: "Fira Mono, monospace"
              }}
            >
              Click to raise a concern.
            </h1>
          </div>
        )}
        <UsersModal
          fullScreen={false}
          open={open}
          data={value}
          setData={e => setValue(e.target.value)}
          title="Handraiser Concern"
          modalTextContent="Please type your concern below."
          handleClose={handleClose}
          handleSubmit={e => sendConcern(e)}
          type="Create Concern"
          buttonText="Raise Concern"
          fab={fab}
        />
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
