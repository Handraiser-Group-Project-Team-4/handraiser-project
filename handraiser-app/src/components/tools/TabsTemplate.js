import React, {useEffect, useContext} from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

import { newUserContext } from "../../routes";
import jwtToken from "../tools/assets/jwtToken";
// import { DarkModeContext } from "../../App";

import {
  Tabs,
  Switch,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";

let socket;
export default function TabsTemplate({
  children,
  tabIndex,
  classes,
  user,
  darkMode,
  setDarkMode
}) {
  const ENDPOINT = "localhost:3001";
  const userObj = jwtToken();
  const history = useHistory();
  const { setActiveUsers } = useContext(newUserContext);

  const handleDarkMode = async () => {
    await axios({
      method: "patch",
      url: `/api/darkmode/${user.user_id}`,
      data: { dark_mode: !darkMode },
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    });
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    axios({
      method: `patch`,
      url: `/api/logout/${userObj.user_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
      socket.emit('activeUser', () => {
        socket.on('displayActiveUser', ({userIsActive}) => {
          console.log(userIsActive)
          setActiveUsers(userIsActive)
        })
      })
    history.push('/')
    sessionStorage.clear();
  };

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
  }, [ENDPOINT]);

  return (
    <Tabs
      orientation="vertical"
      value={tabIndex}
      className={classes.tabs}
      style={{ position: "relative", height: "calc(100vh - 250px)" }}
    >
      <Tab
        style={{ padding: 0 }}
        label={
          <ListItem className={classes.listItemButton}>
            <ListItemIcon
              style={{
                color: "white"
              }}
            >
              {darkMode ? <Brightness4Icon /> : <Brightness7Icon />}
            </ListItemIcon>
            <ListItemText
              className={classes.listItemText}
              primary={darkMode ? "Dark" : "Light"}
            />
            <Switch
              checked={darkMode}
              onChange={handleDarkMode}
              value="checkedB"
              color="default"
            />
          </ListItem>
        }
      />
      {children}
      <Tab
        style={{ padding: 0 }}
        value="team"
        label={
          <ListItem
            onClick={() => history.push("/team")}
            button
            className={classes.listItemButton}
          >
            <ListItemIcon
              style={{
                color: "white"
              }}
            >
              <PeopleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="About" className={classes.listItemText} />
          </ListItem>
        }
        {...a11yProps("team")}
      />
      {/* <Divider className={classes.divider} /> */}
      <Tab
        style={{ padding: 0 }}
        label={
          <ListItem
            to="/"
            renderas={Link}
            onClick={handleLogout}
            button
            className={classes.listItemButton}
          >
            <ListItemIcon
              style={{
                color: "white"
              }}
            >
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" className={classes.listItemText} />
          </ListItem>
        }
      />
    </Tabs>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}
