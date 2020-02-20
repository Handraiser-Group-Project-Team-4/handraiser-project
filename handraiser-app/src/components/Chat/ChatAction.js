import React from "react";
import { Picker } from "emoji-mart";
import clsx from "clsx";
import "emoji-mart/css/emoji-mart.css";

import {
  CardActions,
  IconButton,
  TextField,
  InputAdornment
} from "@material-ui/core";

// ICONS
import SendIcon from "@material-ui/icons/Send";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";

const ChatAction = ({
  showEmoji,
  setMessage,
  message,
  toggleEmoji,
  socket,
  userObj,
  sendMessage,
  classes,
  expanded,
  handleExpandClick
}) => {
  return (
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
          message.match(/\s/g) && message.match(/\s/g).length === message.length
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
  );
};

export default ChatAction;
