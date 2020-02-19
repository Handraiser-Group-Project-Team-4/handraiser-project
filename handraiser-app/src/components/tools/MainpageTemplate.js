import React, { useState, useEffect, Fragment, useContext } from "react";
import { Redirect, Link, useHistory } from "react-router-dom";
import axios from "axios";

// COMPONENTS
import jwtToken from "../tools/assets/jwtToken";
import { DarkModeContext } from "../../App";
import WarningIcon from "@material-ui/icons/Warning";
import TabsTemplate from "./TabsTemplate";

// MATERIAL-UI
import {
  AppBar,
  CssBaseline,
  Drawer,
  Hidden,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Tab,
  makeStyles,
  useTheme,
  Chip,
  Card,
  CardContent
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

// ICONS
import DnsIcon from "@material-ui/icons/Dns";
import MenuIcon from "@material-ui/icons/Menu";
import GroupIcon from "@material-ui/icons/Group";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

export default function MainpageTemplate({ children, container, tabIndex }) {
  const userObj = jwtToken();
  const [user, setUser] = useState();
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const history = useHistory();

  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    let isCancelled = false;
    axios({
      method: "get",
      url: `/api/users/${userObj && userObj.user_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        // console.log(res.data)
        if (!isCancelled) setUser(res.data);
      })
      .catch(err => {
        console.log(err);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (!userObj) return <Redirect to="/" />;
  const drawer = (
    <div>
      <div className={classes.firstToolbar}>
        {user ? (
          <>
            <img src={user.avatar} className={classes.studentImg} alt="" />
            <Typography className={classes.studentImgButton}>
              {user.firstname} {user.lastname}
            </Typography>
            <Chip
              // icon={<FaceIcon />}
              label="*Student"
              color="black"
              style={{
                backgroundColor: "white",
                color: darkMode ? "#000" : null
              }}
            />
          </>
        ) : (
          <>
            <Skeleton
              variant="circle"
              width={85}
              height={85}
              style={{
                backgroundColor: "#8154D1"
              }}
            />
            <Skeleton
              variant="text"
              width={180}
              height={45}
              style={{
                backgroundColor: "#8154D1"
              }}
            />
            <Skeleton
              variant="rect"
              width={80}
              height={30}
              style={{
                borderRadius: 90,
                backgroundColor: "#8154D1"
              }}
            />
          </>
        )}
      </div>
      {user
        ? user.user_role_id === 1 && (
            <TabsTemplate
              tabIndex={tabIndex}
              user={user}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              classes={classes}
            >
              <Tab
                style={{ padding: 0 }}
                value="admin-cohorts"
                label={
                  <ListItem
                    onClick={() => history.push("/admin-page")}
                    button
                    className={classes.listItemButton}
                  >
                    <ListItemIcon
                      style={{
                        color: "white"
                      }}
                    >
                      <DnsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Cohorts"
                      className={classes.listItemText}
                    />
                  </ListItem>
                }
                {...a11yProps("admin-cohorts")}
              />
              <Tab
                style={{ padding: 0 }}
                value="admin-users"
                label={
                  <ListItem
                    onClick={() => history.push("/admin-page/users")}
                    button
                    className={classes.listItemButton}
                  >
                    <ListItemIcon
                      style={{
                        color: "white"
                      }}
                    >
                      <GroupIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Users"
                      className={classes.listItemText}
                    />
                  </ListItem>
                }
                {...a11yProps("admin-users")}
              />
              <Tab
                style={{ padding: 0 }}
                value="admin-approval"
                label={
                  <ListItem
                    onClick={() => history.push("/admin-page/approval")}
                    button
                    className={classes.listItemButton}
                  >
                    <ListItemIcon
                      style={{
                        color: "white"
                      }}
                    >
                      <ThumbUpIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Approval"
                      className={classes.listItemText}
                    />
                  </ListItem>
                }
                {...a11yProps("admin-approval")}
              />
            </TabsTemplate>
          )
        : null}
      {user
        ? user.user_role_id !== 1 && (
            <TabsTemplate
              tabIndex={tabIndex}
              user={user}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              classes={classes}
            >
              <Tab
                style={{ padding: 0 }}
                value="student-page"
                label={
                  <ListItem
                    onClick={() => history.push("/student-page")}
                    button
                    className={classes.listItemButton}
                  >
                    <ListItemIcon
                      style={{
                        color: "white"
                      }}
                    >
                      <DnsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Cohorts"
                      className={classes.listItemText}
                    />
                  </ListItem>
                }
                {...a11yProps("student-page")}
              />
            </TabsTemplate>
          )
        : null}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 240
        }}
      >
        <Card style={{ width: 220 }}>
          <CardContent
            style={{
              paddingBottom: 16,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <WarningIcon />
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              style={{ whiteSpace: "normal", paddingLeft: 10 }}
            >
              Your request to be a mentor is still being processed.
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <Fragment>
      <CssBaseline />
      <div className={classes.mainDiv}>
        <Hidden only={["lg", "md", "xl"]}>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                Handraiser
              </Typography>
            </Toolbar>
          </AppBar>
        </Hidden>
        <nav className={classes.drawer}>
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper
              }}
              ModalProps={{
                keepMounted: true
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <Hidden only={["lg", "md", "xl"]}>
            <div className={classes.toolbar} />
          </Hidden>
          <div className={classes.tabPanel}>{children}</div>
        </main>
      </div>
    </Fragment>
  );
}

const drawerWidth = 245;
const useStyles = makeStyles(theme => ({
  tabPanel: {
    "&>div": {
      padding: 0
    }
  },
  mainDiv: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    },
    backgroundColor: "#673ab7"
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#673ab7"
  },
  content: {
    flexGrow: 1,
    [theme.breakpoints.up("md")]: {
      maxWidth: "calc(100% - 240px)"
    }
  },
  "@global": {
    body: {
      fontFamily: "'Rubik', sans-serif"
    }
  },
  listItemText: {
    "& > span": {
      fontFamily: "'Rubik', sans-serif",
      fontWeight: 500,
      color: "white",
      fontSize: 20
    }
  },
  active: {
    "& > span": {
      color: "#f08080!important"
    }
  },
  activeBorder: {
    borderLeft: "4px solid #f08080",
    textTransform: "uppercase",
    fontFamily: "'Rubik', sans-serif",
    fontWeight: 500,
    color: "#9ea0b8"
  },
  firstToolbar: {
    ...theme.mixins.toolbar,
    minHeight: "12rem!important",
    padding: "30px 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  studentImg: {
    borderRadius: "50%",
    width: 90,
    height: 90,
    cursor: "pointer",
    border: "5px solid transparent",
    boxShadow: "0 0 0 4px #fff"
  },
  studentImgButton: {
    fontFamily: "'Rubik', sans-serif",
    fontWeight: 700,
    textTransform: "capitalize",
    color: "white",
    fontSize: "1.25rem",
    paddingTop: "5px",
    wordBreak: "break-word",
    textAlign: "center"
  },
  navigList: {
    textTransform: "uppercase",
    fontFamily: "'Rubik', sans-serif",
    fontWeight: 500,
    color: "#9ea0b8"
  },
  listItemImg: {
    width: 35,
    height: 35,
    backgroundColor: "#fefefe",
    borderRadius: "10% 30% 50% 70%"
  },
  listItemButton: {
    textTransform: "uppercase",
    fontFamily: "'Rubik', sans-serif",
    fontWeight: 500,
    color: "#9ea0b8"
  },
  divider: {
    backgroundColor: "#ffe4c4"
  }
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}
