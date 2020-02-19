import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import clsx from "clsx";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import ReactHtmlParser from "react-html-parser";
import ScrollableFeed from "react-scrollable-feed";
// MATERIAL-UI
import {
  makeStyles,
  Card,
  CardHeader,
  Box,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  TextField,
  Divider,
  Container,
  InputAdornment,
  MenuItem,
  Menu
} from "@material-ui/core";
import { purple } from "@material-ui/core/colors";
// COMPONENTS
import { UserContext } from "../cohort/cohortQueue/CohortPage";
import jwtToken from "../tools/assets/jwtToken";
import { DarkModeContext } from "../../App";
// ICONS
import SendIcon from "@material-ui/icons/Send";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
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
    padding: "0px!important",
    "& > div > div::-webkit-scrollbar": {
      width: "5px",
      height: "8px",
      backgroundColor: "#FFF",
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10
    },
    "& > div > div::-webkit-scrollbar-thumb": {
      backgroundColor: "#673ab7" //'#23232F' //'#0595DD',
      // borderTopRightRadius: 10
    }
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
    borderRadius: "15px",
    maxWidth: "50%"
  }
}));
let socket;
const Chat = () => {
  const classes = useStyles();
  const userObj = jwtToken();
  const { chatroom } = useContext(UserContext);
  const { darkMode } = useContext(DarkModeContext);
  const [showEmoji, setShowEmoji] = useState(false);
  const [currentChat, setCurrentChat] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState({
    isTyping: false,
    name: ""
  });
  const ENDPOINT = "localhost:3001";
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const handleClose = () => setAnchorEl(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = e => setAnchorEl(e.currentTarget);

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
    socket.emit("join", { chatroom }, () => {
      socket.on("oldChat", data => {
        setCurrentChat(data.data.messages);
      });
    });
  }, [ENDPOINT, chatroom]);

  useEffect(() => {
    if (message.length <= 0) socket.emit("NotTyping", { name: userObj.name });
    socket.on("message", message => {
      setCurrentChat([...currentChat, message]);
    });
    socket.on("displayTyping", ({ name }) => {
      setTyping({ isTyping: true, name });
    });
    socket.on("displayNotTyping", ({ name }) => {
      setTyping({ isTyping: false, name: "" });
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [currentChat, chatroom]);

  const sendMessage = event => {
    setOpen(true);
    setMessage("");
    event.preventDefault();
    const temp = message.replace(/\n/g, "<br />");
    if (message) {
      socket.emit("sendMessage", { message: temp }, () => setMessage(""));
      socket.emit("NotTyping", { name: userObj.name });
    }
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const toggleEmoji = () => {
    setShowEmoji(!showEmoji);
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
              <MenuItem onClick={e => console.log(chatroom)}>
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
            {currentChat.map(
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
                        <Container
                          className={classes.chat}
                          style={{
                            backgroundColor: darkMode ? "#303030" : null
                          }}
                        >
                          <Typography variant="body2">
                            {ReactHtmlParser(message.text)}
                          </Typography>
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
                        <Container
                          className={classes.chat}
                          style={{
                            backgroundColor: darkMode ? "#303030" : null
                          }}
                        >
                          <Typography variant="body2">
                            {ReactHtmlParser(message.text)}
                          </Typography>
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
      {chatroom.concern_status !== "done" ? (
        <CardActions disableSpacing>
          <TextField
            InputProps={{
              startAdornment: showEmoji && (
                <Picker
                  set="facebook"
                  title="Pick your emoji…"
                  emoji="point_up"
                  sheetSize={64}
                  onSelect={emoji => setMessage(message + emoji.native)}
                  style={{
                    position: "absolute",
                    bottom: "45px",
                    right: "20px",
                    zIndex: 2
                  }}
                />
              ),
              endAdornment: (
                <InputAdornment position="start">
                  <InsertEmoticonIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleEmoji()}
                  />
                </InputAdornment>
              )
            }}
            multiline
            rowsMax="5"
            style={{ margin: 8 }}
            placeholder="Send a message here"
            fullWidth
            margin="normal"
            variant="outlined"
            value={message}
            value={message}
            onChange={({ target: { value } }) => {
              setMessage(value);
              socket.emit("typing", { name: userObj.name });
            }}
            onBlur={() => socket.emit("NotTyping", { name: userObj.name })}
            onKeyDown={event =>
              message.match(/\s/g) &&
              message.match(/\s/g).length === message.length
                ? null
                : event.keyCode === 13 && !event.shiftKey
                ? sendMessage(event)
                : null
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
      ) : (
        ""
      )}
    </Card>
    // </Container>
  );
};
export default Chat;
