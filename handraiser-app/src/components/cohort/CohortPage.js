import React, { createContext, useState, useEffect } from "react";
import MainpageTemplate from "../tools/MainpageTemplate";
import { Link } from "react-router-dom";
import Help from "./Help";
import NeedHelp from "./NeedHelp";
import BeingHelp from "./BeingHelp";
import Chat from "../Chat/Chat";
import Axios from "axios";
import jwtToken from "../tools/assets/jwtToken";
import io from "socket.io-client";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { useSnackbar } from "notistack";

export const UserContext = createContext(null);
let socket;
const userDetails = {
  username: "noe",
  room: "3"
};

export default function CohortPage(props) {
  const ENDPOINT = "localhost:3001";
  const classes = useStyles();
  const userObj = jwtToken();
  const { id } = props.match.params;
  const [data, setData] = useState([]);
  const [user, setUser] = useState();
  const [chatroom, setChatRoom] = useState({
    room: 187,
    concern: "Request for help"
  });
  const { enqueueSnackbar } = useSnackbar();
  // const [concern] = useState({
  //   class_id: 1,
  //   mentor_id: null,
  //   student_id: userObj.user_id,
  //   concern_title: "Request for help",
  //   concern_status: "pending"
  // });

  useEffect(() => {
    Axios({
      method: "get",
      url: `/api/concern/${id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        setChatRoom({
          room: res.data[0].concern_id,
          concern: res.data[0].concern_title
        });
      })
      .catch(err => console.log(err));
  }, [data]);

  useEffect(() => {
    Axios({
      method: "get",
      url: `/api/users/${userObj.user_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
    socket.emit("joinConcern", { id }, error => {});
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("concernData", ({ concern, alert }) => {
      setData([...concern]);
      alert &&
        enqueueSnackbar(`${alert.name + " " + alert.action}`, {
          variant: alert.variant,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right"
          }
        });
    });
    return () => {
      socket.emit("disconnectConcern");
      socket.off();
    };
  }, [data]);

  const sendConcern = (event, concern) => {
    event.stopPropagation();
    if (concern) {
      socket.emit("sendConcern", { concern }, () => {});
    }
  };

  const chatHandler = (event, value) => {
    event.stopPropagation();
    setChatRoom(value);
  };

  const handleClickVariant = userVariant => () => {
    enqueueSnackbar(`${userObj.name} request for help`, {
      variant: userVariant,
      anchorOrigin: {
        vertical: "top",
        horizontal: "right"
      }
    });
  };

  return (
    <MainpageTemplate>
      <Link to="/">Go Back</Link>
      <div
      // style={{
      //   height: `100vh`
      // }}
      >
        <div className={classes.root}>
          <UserContext.Provider
            value={{
              id,
              chatroom,
              setChatRoom,
              data,
              setData,
              user,
              setUser,
              chatHandler
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={6} lg={3}>
                {/* {userObj.user_role_id === 3 ? (
                  <button onClick={e => sendConcern(e, concern)}>
                    Send Concern
                  </button>
                ) : (
                  ""
                )} */}
                <button onClick={handleClickVariant("success")}>
                  Click Me
                </button>
                <Help />
                <NeedHelp />
                <BeingHelp />
              </Grid>
              <Grid item xs={6} lg={9}>
                <Chat userDetails={userDetails} room={chatroom} />
              </Grid>
            </Grid>
          </UserContext.Provider>
        </div>
      </div>
    </MainpageTemplate>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: 50
  }
}));
