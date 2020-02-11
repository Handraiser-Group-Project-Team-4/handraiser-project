import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import jwtToken from "../tools/assets/jwtToken";
import io from "socket.io-client";

import MainpageTemplate from "../tools/MainpageTemplate";
import CohortList from "../cohort/CohortList";

let socket;
export default function StudentPage({ location }) {
  const [request, setRequest] = useState();
  const ENDPOINT = "localhost:3001";
  const userObj = jwtToken();

  if (location.state)
    if (location.state.isNew) sessionStorage.setItem("newUser", "true");

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("studentToMentor", user_id => {
      console.log(user_id, userObj.user_id);
      if (userObj.user_id === user_id)
        alert(
          `Your role has been change to Mentor. Please Logout to see the changes!`
        );
    });
  });

  useEffect(() => {
    socket.on("notifyUser", ({ user_id, approval_status }) => {
      // console.log(user_id, approval_status)
      if (userObj.user_id === user_id) {
        if (approval_status.user_approval_status_id === 1)
          alert(
            `Your Request has been Approve. Please Logout to see the changes!`
          );

        if (approval_status.user_approval_status_id === 3)
          alert(
            `Your Request has been Disapprove. Reason: ${approval_status.reason_disapproved}`
          );
      }
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  });

  const handleMentor = () => {
    axios({
      method: `patch`,
      url: `/api/pending/${userObj.user_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        setRequest("pending");
        sessionStorage.setItem("newUser", "pending");

        socket.emit("mentorRequest", { data: userObj });

        setTimeout(() => {
          alert(`Request Successfully Sent.`);
        }, 500);

        console.log(res);
      })
      .catch(err => console.log(err));
  };

  if (userObj) {
    if (userObj.user_role_id === 1) return <Redirect to="/admin-page" />;
    else if (userObj.user_role_id === 2) return <Redirect to="/mentor-page" />;
  } else return <Redirect to="/" />;

  return (
    <MainpageTemplate>
      <div
        style={{
          display: `flex`,
          flexDirection: `column`,
          justifyContent: `center`,
          alignItems: `center`,
          height: `100vh`
        }}
      >
        <h1>THIS IS WHERE THE COHORT LIST IS LOCATED</h1>
        <CohortList />
        {sessionStorage.getItem("newUser") === "pending" ||
        request === "pending" ||
        userObj.user_approval_status_id === 2 ? (
          <h3>Request Sent. Waiting for Confirmation!</h3>
        ) : sessionStorage.getItem("newUser") === "true" ? (
          <button onClick={handleMentor}>I'am a Mentor</button>
        ) : null}
      </div>
    </MainpageTemplate>
  );
}
