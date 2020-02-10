import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import jwtToken from "../tools/assets/jwtToken";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ScrollableFeed from "react-scrollable-feed";
import { UserContext } from "../cohort/CohortPage";
import { purple } from "@material-ui/core/colors";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import SendIcon from "@material-ui/icons/Send";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Container from "@material-ui/core/Container";

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
    padding: "10px",
    margin: "0",
    width: "auto",
    backgroundColor: "#F5F5F5",
    borderRadius: "15px"
  }
}));

let socket;
const Chat = () => {
  const classes = useStyles();
  const userObj = jwtToken();
  const { chatroom } = useContext(UserContext);
  const [expanded, setExpanded] = useState(false);
  const [oldChat, setOldChat] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [message, setMessage] = useState("");
  const ENDPOINT = "localhost:3001";

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
    socket.emit(
      "join",
      { username: userObj.name, chatroom: chatroom.room, userObj },
      () => {
        socket.on("oldChat", data => {
          setCurrentChat([]);
          setOldChat(data.data.messages);
        });
      }
    );
  }, [ENDPOINT, chatroom]);

  useEffect(() => {
    socket.on("message", message => {
      setCurrentChat([...currentChat, message]);
    });
    // socket.emit("saveChat", currentChat);
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

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
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
          title={chatroom.concern}
          subheader="September 14, 2016"
        />
        <Divider />
        <CardContent className={classes.media}>
          <Box style={{ maxHeight: 500, overflow: "auto" }}>
            <ScrollableFeed>
              {oldChat.map(
                (message, i) =>
                  message.concern_id === chatroom.room && (
                    <div key={i}>
                      {message.user_id !== userObj.user_id ? (
                        <Box
                          display="flex"
                          justifyContent="flex-start"
                          alignContent="flex-start"
                          style={{ paddingBottom: "15px" }}
                        >
                          <Avatar
                            className={classes.chatAvatar}
                            src={message.avatar}
                          />
                          <Container className={classes.chat}>
                            {message.text}
                            <p
                              style={{
                                opacity: `0.4`,
                                fontSize: "10px",
                                margin: "0",
                                paddingTop: "10px"
                              }}
                            >
                              {message.time_sent}
                            </p>
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
                            <p
                              style={{
                                opacity: `0.5`,
                                fontSize: "10px",
                                margin: "0",
                                paddingTop: "10px"
                              }}
                            >
                              {message.time_sent}
                            </p>
                          </Container>
                          <Avatar
                            className={classes.chatLeftAvatar}
                            src={message.avatar}
                          />
                        </Box>
                      )}
                    </div>
                  )
              )}
              {currentChat.map(
                (message, i) =>
                  message.concern_id === chatroom.room && (
                    <div key={i}>
                      {message.user_id !== userObj.user_id ? (
                        <Box
                          display="flex"
                          justifyContent="flex-start"
                          alignContent="flex-start"
                          style={{ paddingBottom: "15px" }}
                        >
                          <Avatar
                            className={classes.chatAvatar}
                            src={message.avatar}
                          />
                          <Container className={classes.chat}>
                            {message.text}
                            <p
                              style={{
                                opacity: `0.4`,
                                fontSize: "10px",
                                margin: "0",
                                paddingTop: "10px"
                              }}
                            >
                              {message.time_sent}
                            </p>
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
                            <p
                              style={{
                                opacity: `0.5`,
                                fontSize: "10px",
                                margin: "0",
                                paddingTop: "10px"
                              }}
                            >
                              {message.time_sent}
                            </p>
                          </Container>
                          <Avatar
                            className={classes.chatLeftAvatar}
                            src={message.avatar}
                          />
                        </Box>
                      )}
                    </div>
                  )
              )}
            </ScrollableFeed>
          </Box>
        </CardContent>
        <CardActions disableSpacing>
          <TextField
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
