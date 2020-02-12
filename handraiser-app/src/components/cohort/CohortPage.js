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
import Grid from "@material-ui/core/Grid";
import { useSnackbar } from "notistack";

export const UserContext = createContext(null);
let socket;

export default function CohortPage(props) {
  const ENDPOINT = "localhost:3001";
  const classes = useStyles();
  const userObj = jwtToken();
  const { id } = props.match.params;
  const [data, setData] = useState([]);
  const [user, setUser] = useState();
  const [chatroom, setChatRoom] = useState();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    Axios({
      method: "get",
      url: `/api/users/${userObj.user_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        console.log(res.data);
        setUser(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
    socket.emit("joinConcern", { id }, () => {});
  }, [ENDPOINT]);

  useEffect(() => {
    socket.emit("getChatroom", { id }, () => {});
    socket.on("chatroomData", ({ data }) => {
      data.length
        ? setChatRoom({
            room: data[0].concern_id,
            concern: data[0].concern_title
          })
        : setChatRoom();
    });
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
      socket.emit("disconnectConcern", () => {});
      socket.off();
    };
  }, [data]);

  const chatHandler = (event, value) => {
    event.stopPropagation();
    setChatRoom(value);
  };

  return (
    <MainpageTemplate>
      <Link to="/">Go Back</Link>
      <div>
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
                <Help />
                <NeedHelp />
                <BeingHelp />
              </Grid>
              <Grid item xs={6} lg={9}>
                {chatroom && <Chat />}
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
