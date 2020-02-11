import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import jwtToken from "../tools/assets/jwtToken";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  CardHeader,
  Typography,
  MenuItem,
  Menu,
  Card,
  Box,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  TextField,
  Divider,
  Container
} from "@material-ui/core";
import ScrollableFeed from "react-scrollable-feed";
import { UserContext } from "../cohort/CohortPage";
import { purple } from "@material-ui/core/colors";
import SendIcon from "@material-ui/icons/Send";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 10,
    boxShadow: "4px 4px 12px 1px rgba(0, 0, 0, 0.2)",
    lineHeight: 1.5,
    overflowY: "auto",
    // minHeight: "80vh",
    width: "80%"
  },
  media: {
    height: "100%",
    minHeight: "500px",
    padding: "0px!important"
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
  const handleClose = () => setAnchorEl(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = e => setAnchorEl(e.currentTarget);
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
    // <Container maxWidth="md">
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <>
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              elevation={1}
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={e => alert("Add Mentor")}>
                {/* <ListItemIcon>
                      <HelpIcon />
                    </ListItemIcon> */}
                <Typography variant="inherit">Add Mentor</Typography>
              </MenuItem>
            </Menu>
          </>
        }
        title={chatroom.concern}
        subheader="September 14, 2016"
      />
      <Divider />
      <CardContent className={classes.media}>
        <Box
          style={{
            maxHeight: 600,
            overflow: "auto"
          }}
        >
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
                        style={{
                          paddingBottom: 15,
                          paddingRight: 12,
                          paddingTop: i === 0 ? 10 : 0,
                          paddingLeft: 12
                        }}
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
                        style={{
                          paddingBottom: 15,
                          paddingRight: 12,
                          paddingTop: i === 0 ? 10 : 0,
                          paddingLeft: 12
                        }}
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
    // </Container>
  );
};

export default Chat;
