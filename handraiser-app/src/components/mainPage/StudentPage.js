import React, { useState, useEffect, useContext } from "react";

import axios from "axios";
import { Redirect, useHistory } from "react-router-dom";
import io from "socket.io-client";
import { useSnackbar } from "notistack";

// COMPONENTS
import { newUserContext } from "../../routes";
import jwtToken from "../tools/assets/jwtToken";
import MainpageTemplate from "../tools/MainpageTemplate";
import CohortList from "../cohort/CohortList";
import UsersModal from "../tools/UsersModal";

// MATERIAL-UI
import { AppBar, Tabs, Tab } from "@material-ui/core";

//STYLES
import useStyles from "./Style";

let socket;
export default function StudentPage({ value, tabIndex }) {
  const { enqueueSnackbar } = useSnackbar();
  const [request, setRequest] = useState();
  const [open, setOpen] = useState(false);
  const { isNew, setisNew } = useContext(newUserContext);
  const ENDPOINT = "172.60.63.82:3001";
  const userObj = jwtToken();
  const classes = useStyles();
  const history = useHistory();

  sessionStorage.setItem("newUser", isNew);

  useEffect(() => {
    if (isNew) setOpen(true);
  }, [isNew]);

  useEffect(() => {
    return () => {
      setisNew(false);
    };
  }, [setisNew]);

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
  }, [ENDPOINT]);

  // useEffect(() => {
  //   socket.on("studentToMentor", user_id => {
  //     if (userObj.user_id === user_id)
  //       alert(
  //         `Your role has been change to Mentor. Please Logout to see the changes!`
  //       );
  //   });
  // });

  // useEffect(() => {
  //   socket.on("notifyUser", ({ user_id, approval_status }) => {
  //     if (userObj.user_id === user_id) {
  //       if (approval_status.user_approval_status_id === 1)
  //         alert(
  //           `Your Request has been Approve. Please Logout to see the changes!`
  //         );

  //       if (approval_status.user_approval_status_id === 3)
  //         alert(
  //           `Your Request has been Disapprove. Reason: ${approval_status.reason_disapproved}`
  //         );
  //     }
  //   });

  //   return () => {
  //     socket.emit("disconnect");
  //     socket.off();
  //   };
  // });

  const handleMentor = () => {
    axios({
      method: `patch`,
      url: `/api/pending/${userObj.user_id}?name=${userObj.name}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        setRequest("pending");
        sessionStorage.setItem("newUser", "pending");

        socket.emit("mentorRequest", { data: userObj });
        setOpen(false);
        enqueueSnackbar(
          `Request Successfully Sent. Please Wait for the confirmation!`,
          { variant: `success` }
        );

        // setTimeout(() => {
        //   alert(`Request Successfully Sent. Please Wait for the confirmation!`);
        // }, 500);
        // setOpen(true);
        // console.log(res);
      })
      .catch(err => console.log(err));
  };

  if (userObj) {
    if (userObj.user_role_id === 1) return <Redirect to="/admin-page" />;
    else if (userObj.user_role_id === 2) return <Redirect to="/mentor-page" />;
  } else return <Redirect to="/" />;

  return (
    <MainpageTemplate tabIndex={tabIndex} request={request}>
      {// sessionStorage.getItem("newUser") === "pending" ||
      // request === "pending" ||
      // userObj.user_approval_status_id === 2 ? (
      //   <h3>Request Sent. Waiting for Confirmation!</h3>
      // ) : (
      sessionStorage.getItem("newUser") === "true" && (
        <UsersModal
          open={open}
          title="Welcome to Handraiser App!"
          modalTextContent=" Are you a Mentor?"
          handleClose={() => setOpen(false)}
          handleSubmit={handleMentor}
          type="New User"
          buttonText="I'am a Mentor"
        />
      )}

      <div className={classes.parentDiv}>
        <div className={classes.tabRoot}>
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              // onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab
                label="All Cohorts"
                onClick={() => history.push("/student-page")}
              />
              <Tab
                label="My Cohorts"
                onClick={() => history.push("/student-page/my-cohort")}
              />
            </Tabs>
          </AppBar>
          <CohortList classes={classes} value={value} />
        </div>
      </div>
    </MainpageTemplate>
  );
}
