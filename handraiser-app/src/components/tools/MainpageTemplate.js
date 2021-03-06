import React, { useState, useEffect, Fragment, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

// COMPONENTS
import jwtToken from "../tools/assets/jwtToken";
import { DarkModeContext } from "../../App";

import UsersModal from "../tools/UsersModal";
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
  Card,
  CardContent,
  makeStyles,
  useTheme,
  Chip
} from "@material-ui/core";
import { useSnackbar } from "notistack";

// ICONS
// import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
// import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import DnsIcon from "@material-ui/icons/Dns";
import MenuIcon from "@material-ui/icons/Menu";
import GroupIcon from "@material-ui/icons/Group";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import WarningIcon from "@material-ui/icons/Warning";

let socket;
export default function MainpageTemplate({
  children,
  container,
  tabIndex,
  request
}) {
  const ENDPOINT = "172.60.63.82:3001";
  const userObj = jwtToken();
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const history = useHistory();
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const { enqueueSnackbar } = useSnackbar();
  const [notify, setNotify] = useState({
    open: false,
    title: "",
    buttonText: "",
    type: "",
    modalTextContent: ""
  });
  const [notifyNotLogout, setNotifyNotLogout] = useState({
    open: false,
    title: "",
    buttonText: "",
    type: "",
    modalTextContent: ""
  });
  const [open, setOpen] = React.useState(false);
  const [modal, setModal] = React.useState(false);

  // const handleLogout = () => {
  //   setNotify({ ...notify, open: false })
  //   axios({
  //     method: `patch`,
  //     url: `/api/logout/${userObj.user_id}`,
  //     headers: {
  //       Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
  //     }
  //   })
  //     .then(res => {
  //       console.log(res);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  //   sessionStorage.clear();
  // };

  useEffect(() => {
    let login = sessionStorage.getItem("notification") ? true : false;
    if (login) {
      enqueueSnackbar(sessionStorage.getItem("notification"), {
        variant: "success",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right"
        }
      });
      sessionStorage.removeItem("notification");
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("notifyAssignedMentor", ({ user_id, class_title }) => {
      if (userObj.user_id === user_id)
        setNotifyNotLogout({
          open: true,
          title: `You just have been enrolled  ${
            userObj.user_role_id === 2 ? `as Mentor` : ""
          } on ${class_title}!`,
          modalTextContent:
            userObj.user_role_id === 2
              ? "Please Check your Email for the cohort credentials."
              : "",
          buttonText: "Agree",
          type: "studentAsignedMentor"
        });
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  });

  useEffect(() => {
    socket.on("notifyKicked", ({ user_id, classroom }) => {
      if (userObj.user_id === user_id)
        setNotifyNotLogout({
          open: true,
          title: `You just have been kick from ${classroom.class_title}!`,
          buttonText: "Agree",
          type: "studentKicked"
        });
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  });

  useEffect(() => {
    socket.on("mentorToStudent", user_id => {
      if (userObj.user_id === user_id)
        // alert(`Your role has been change to Student Please Logout to see the changes!`);
        setNotify({
          open: true,
          title: "Your role has been change to Student.",
          modalTextContent: "Please Logout to see the changes!",
          buttonText: "Logout",
          type: "mentorToStudent"
        });
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  });

  useEffect(() => {
    socket.on("studentToMentor", user_id => {
      if (userObj.user_id === user_id)
        // alert(`Your role has been change to Mentor. Please Logout to see the changes!`);
        setNotify({
          open: true,
          title: "Your role has been change to Mentor.",
          modalTextContent: "Please Logout to see the changes!",
          buttonText: "Logout",
          type: "studentToMentor"
        });
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  });

  useEffect(() => {
    socket.on("notifyUser", ({ user_id, approval_status }) => {
      if (userObj.user_id === user_id) {
        if (approval_status.user_approval_status_id === 1)
          // alert(`Your Request has been Approve. Please Logout to see the changes!`);
          setNotify({
            open: true,
            title: "Your Request to be a Mentor has been Approve.",
            modalTextContent: "Please Logout to see the changes!",
            buttonText: "Logout",
            type: "notifyUserApprove"
          });

        if (approval_status.user_approval_status_id === 3)
          // alert(`Your Request has been Disapprove. Reason: ${approval_status.reason_disapproved}`);
          setNotifyNotLogout({
            open: true,
            title: `Your Request to be a Mentor has been Disapprove.`,
            modalTextContent: `Reason: ${approval_status.reason_disapproved}`,
            buttonText: "Agree",
            type: "notifyUserDisapprove"
          });
      }
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  });

  // const handleDarkMode = async () => {
  //   await axios({
  //     method: "patch",
  //     url: `/api/darkmode/${userObj.user_id}`,
  //     data: { dark_mode: !darkMode },
  //     headers: {
  //       Authorization: "Bearer " + sessionStorage.getItem("accessToken")
  //     }
  //   });
  //   setDarkMode(!darkMode);
  // };

  const handleLogout = () => {
    setNotify({ ...notify, open: false });
    setModal(false);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
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
      sessionStorage.clear();
      sessionStorage.setItem("notification", `Successfully logged out`);
      history.push("/");
    }, 1000);
  };
  if (!userObj) return <Redirect to="/" />;
  const drawer = (
    <div>
      <div className={classes.firstToolbar}>
        <img src={userObj.avatar} className={classes.studentImg} alt="" />
        <Typography className={classes.studentImgButton}>
          {userObj.name}
        </Typography>
        <p style={{ margin: `0 0 10px 0`, fontSize: `12px`, color: `white` }}>
          {userObj.email}
        </p>
        <Chip
          // icon={<FaceIcon />}
          label={
            userObj.user_role_id === 3
              ? `Student`
              : userObj.user_role_id === 2
              ? `Mentor`
              : `Admin`
          }
          color="primary"
          style={{
            backgroundColor: "white",
            color: "#000"
          }}
        />
      </div>
      {userObj.user_role_id === 1 && (
        <TabsTemplate
          tabIndex={tabIndex}
          user={userObj}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          classes={classes}
          open={open}
          modal={modal}
          setModal={setModal}
          setOpen={setOpen}
          handleLogout={handleLogout}
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
      )}
      {userObj.user_role_id !== 1 && (
        <TabsTemplate
          tabIndex={tabIndex}
          user={userObj}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          classes={classes}
          open={open}
          modal={modal}
          setModal={setModal}
          setOpen={setOpen}
          handleLogout={handleLogout}
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
      )}
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
        {(userObj.user_approval_status_id === 2 ||
          sessionStorage.getItem("newUser") === "pending" ||
          request === "pending") && (
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
        )}
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
      {notify.open && (
        <UsersModal
          open={notify.open}
          title={notify.title}
          modalTextContent={notify.modalTextContent}
          handleClose={() => setNotify({ ...notify, open: false })}
          handleSubmit={handleLogout}
          type={notify.type}
          buttonText={notify.buttonText}
        />
      )}

      {notifyNotLogout.open && (
        <UsersModal
          open={notifyNotLogout.open}
          title={notifyNotLogout.title}
          modalTextContent={notifyNotLogout.modalTextContent}
          handleClose={() =>
            setNotifyNotLogout({ ...notifyNotLogout, open: false })
          }
          handleSubmit={() =>
            setNotifyNotLogout({ ...notifyNotLogout, open: false })
          }
          type={notifyNotLogout.type}
          buttonText={notifyNotLogout.buttonText}
        />
      )}
    </Fragment>
  );
}

const drawerWidth = 245;
const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff"
  },
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
    textAlign: "center",
    width: "90%"
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
