import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Box from "@material-ui/core/Box";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
// import styled from "styled-components";
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
    // paddingBottom: "15px",
    padding: "10px",
    margin: "0",
    width: "auto",
    backgroundColor: "lightgrey",
    borderRadius: "50px"
  }
}));

const Design = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

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
          title="React Hook useEffect has a missing dependency"
          subheader="September 14, 2016"
        />
        <Divider />
        <CardContent className={classes.media}>
          <Box style={{ maxHeight: 500, overflow: "auto" }}>
            <Box
              display="flex"
              justifyContent="flex-start"
              alignContent="flex-start"
              style={{ paddingBottom: "15px" }}
            >
              <Avatar className={classes.chatAvatar}>H</Avatar>
              <Container className={classes.chat}>Hi</Container>
            </Box>
            <Box
              display="flex"
              justifyContent="flex-end"
              alignContent="flex-start"
              style={{ paddingBottom: "15px" }}
            >
              <Container className={classes.chat}>Hello</Container>
              <Avatar className={classes.chatLeftAvatar}>H</Avatar>
            </Box>
          </Box>
        </CardContent>
        <CardActions disableSpacing>
          <TextField
            id="filled-full-width"
            style={{ margin: 8 }}
            placeholder="Send a message here"
            fullwidth
            margin="normal"
            variant="outlined"
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

export default Design;
