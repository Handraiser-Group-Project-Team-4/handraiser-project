import React, { useState, useEffect, Fragment, useContext } from "react";
import { Redirect, Link, useHistory } from "react-router-dom";
import axios from "axios";

// COMPONENTS
import jwtToken from "../tools/assets/jwtToken";
import { DarkModeContext } from "../../App";
import WarningIcon from "@material-ui/icons/Warning";

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
  Tabs,
  Switch,
  makeStyles,
  useTheme,
  Chip,
  Card,
  CardContent,
  Backdrop,
  Button,
	CircularProgress,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,Slide
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { useSnackbar } from "notistack";

// ICONS
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import DnsIcon from "@material-ui/icons/Dns";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";

export default function MainpageTemplate({
  children,
  container,
  tabIndex = 0
}) {
  const userObj = jwtToken();
  const [user, setUser] = useState();
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const [modal, setModal] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const history = useHistory();

  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let login = sessionStorage.getItem('notification') ? true : false;
		if (login) {
      enqueueSnackbar(sessionStorage.getItem('notification'), {
        variant: 'success',
        anchorOrigin: {
          vertical: "top",
          horizontal: "right"
        }
      });
      sessionStorage.removeItem('notification');
		}
  }, []);
  
  const handleLogout = () => {
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
      sessionStorage.setItem(
        'notification',
        `Successfully logged out`
      );
      history.push('/');
    }, 2000);
  };

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

  const handleDarkMode = async () => {
    let res = await axios({
      method: "patch",
      url: `/api/darkmode/${user.user_id}`,
      data: { dark_mode: !darkMode },
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    });
    setDarkMode(!darkMode);
  };

  if (!userObj) return <Redirect to="/" />;

  const drawer = (
    <div>
      <div className={classes.firstToolbar}>
        {
          user ? (
          <>
            <img src={user.avatar} className={classes.studentImg} alt="" />
            <Typography className={classes.studentImgButton}>
              {user.firstname} {user.lastname}
            </Typography>
            <Chip
              // icon={<FaceIcon />}
              label={
                user.user_role_id === 1 ? 'Admin' : 
                user.user_role_id === 2 ? 'Mentor' : 
                user.user_role_id === 3 ? 'Student' : null
              }
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
      <Tabs
        orientation="vertical"
        value={tabIndex}
        className={classes.tabs}
        style={{ position: "relative", height: "calc(100vh - 250px)" }}
      >
        <Tab
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
        />
        <Tab
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
              <ListItemText primary="Team" className={classes.listItemText} />
            </ListItem>
          }
        />
        <Tab
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
        <Tab
          label={
            <ListItem
              to="/"
              renderas={Link}
              onClick={() => setModal(true)}
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
      <div
          style={{
            position: "absolute",
            bottom: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 230
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

      <Dialog
        open={modal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setModal(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary">
            Log Out 
          </Button>
        </DialogActions>
      </Dialog>

			<Backdrop
				className={classes.backdrop}
				open={open}
				onClick={() => setOpen(true)}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
    </Fragment>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
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
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    "& button": {
      padding: 0
    }
  }
}));
