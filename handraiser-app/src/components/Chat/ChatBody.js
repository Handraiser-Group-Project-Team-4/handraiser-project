import React from "react";
import ReactHtmlParser from "react-html-parser";
import ScrollableFeed from "react-scrollable-feed";

import {
  Box,
  CardContent,
  Avatar,
  Typography,
  Container
} from "@material-ui/core";

const ChatBody = ({ classes, currentChat, chatroom, userObj, darkMode }) => {
  return (
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
  );
};

export default ChatBody;
