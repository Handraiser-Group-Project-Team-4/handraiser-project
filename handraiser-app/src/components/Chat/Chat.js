import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import jwtToken from "../tools/jwtToken";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import styled from "styled-components";
import { purple } from "@material-ui/core/colors";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import SendIcon from "@material-ui/icons/Send";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Container from "@material-ui/core/Container";
import ScrollableFeed from "react-scrollable-feed";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 900
  },
  media: {
    height: "500px"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(360deg)"
  },
  avatar: {
    backgroundColor: purple[300]
  },
  chatAvatar: {
    marginRight: "10px"
  },
  chatLeftAvatar: {
    marginLeft: "10px"
  },
  chat: {
    // paddingBottom: "15px",
    padding: "10px",
    margin: "0",
    width: "auto",
    backgroundColor: "lightgrey",
    borderRadius: "50px"
  }
}));

let socket;
const Chat = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const username = `noe`,
    room = "3";
  const userObj = jwtToken();
  // const [chatDetails, setChatDetails] = useState({
  //     name:"",
  //     room:"",
  //     avatar:"",
  // });
  // const [username, setUsername] = useState("");
  // const [room, setRoom] = useState("");
  const [oldChat, setOldChat] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [message, setMessage] = useState("");
  const ENDPOINT = "localhost:3001";

  useEffect(() => {
    axios({
      method: "get",
      url: `/api/users/${userObj.user_id}?chat=true`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        // console.log(res.data)
        // setChatDetails({
        //     name: res.data.firstname + " " + res.data.lastname,
        //     room: `'${res.data.concern_id}'`,
        //     avatar: res.data.avatar
        // })

        // setUsername(res.data.users_concern.firstname + " " + res.data.users_concern.lastname);
        // setRoom(res.data.users_concern.concern_id);

        setOldChat(res.data.messages);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
    socket.emit("join", { username, room, userObj }, error => {});
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("message", message => {
      // console.log(message)
      setCurrentChat([...currentChat, message]);
    });
    socket.emit("saveChat", currentChat);

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [currentChat]);

  const sendMessage = event => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", { message }, () => setMessage(""));
    }
  };

  // console.log(message, currentChat);
  return (
    // <div
    //   style={{
    //     display: "flex",
    //     flexDirection: "column",
    //     justifyContent: "center",
    //     alignContent: "center",
    //     padding: "100px",
    //     flexWrap: "wrap"
    //   }}
    // >
    //   <h1>Chat</h1>
    //   <p>{"Name: " + username}</p>
    //   <p style={{ paddingBottom: "80px" }}>{"Room: " + room}</p>
    //   {oldChat.map((message, i) => (
    //     <div key={i}>
    //       <div>{message.user + " " + message.text}</div>
    //       <p style={{ opacity: `0.5`, fontSize: `10px`, margin: `0` }}>
    //         {message.time_sent}
    //       </p>
    //     </div>
    //   ))}
    //   {currentChat.map((message, i) => (
    //     <div key={i}>
    //       <div>{message.user + " " + message.text}</div>
    //       <p style={{ opacity: `0.5`, fontSize: `10px`, margin: `0` }}>
    //         {message.time_sent}
    //       </p>
    //     </div>
    //   ))}
    //   <input
    //     style={{ marginTop: "50px", padding: "30px" }}
    //     value={message}
    //     onChange={({ target: { value } }) => setMessage(value)}
    //     onKeyPress={event =>
    //       event.key === "Enter" ? sendMessage(event) : null
    //     }
    //   />
    // </div>
    <Container maxWidth="md">
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              R
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="React Hook useEffect has a missing dependency"
          subheader="September 14, 2016"
        />
        <Divider />
        <CardContent className={classes.media}>
          <Box style={{ maxHeight: 500, overflow: "auto" }}>
            <ScrollableFeed>
              {oldChat.map((message, i) => (
                <div key={i}>
                  {message.user_id != userObj.user_id ? (
                    <Box
                      display="flex"
                      justifyContent="flex-start"
                      alignContent="flex-start"
                      style={{ paddingBottom: "15px" }}
                    >
                      <Avatar className={classes.chatAvatar}>H</Avatar>
                      <Container className={classes.chat}>
                        {message.text}
                      </Container>
                    </Box>
                  ) : (
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      style={{ paddingBottom: "15px" }}
                    >
                      <Container className={classes.chat}>
                        {message.text}
                      </Container>
                      <Avatar className={classes.chatLeftAvatar} />
                    </Box>
                  )}
                </div>
              ))}
              {currentChat.map((message, i) => (
                <div key={i}>
                  {message.user_id != userObj.user_id ? (
                    <Box
                      display="flex"
                      justifyContent="flex-start"
                      alignContent="flex-start"
                      style={{ paddingBottom: "15px" }}
                    >
                      <Avatar className={classes.chatAvatar}>H</Avatar>
                      <Container className={classes.chat}>
                        {message.text}
                      </Container>
                    </Box>
                  ) : (
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      alignContent="flex-start"
                      style={{ paddingBottom: "15px" }}
                    >
                      <Container className={classes.chat}>
                        {message.text}
                      </Container>
                      <Avatar className={classes.chatLeftAvatar} />
                    </Box>
                  )}
                </div>
              ))}
            </ScrollableFeed>
          </Box>
        </CardContent>
        <CardActions disableSpacing>
          <TextField
            id="filled-full-width"
            style={{ margin: 8 }}
            placeholder="Send a message here"
            fullWidth
            margin="normal"
            variant="outlined"
            value={message}
            onChange={({ target: { value } }) => setMessage(value)}
            onKeyPress={event =>
              event.key === "Enter" ? sendMessage(event) : null
            }
          />
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <SendIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Container>
  );
};

export default Chat;
