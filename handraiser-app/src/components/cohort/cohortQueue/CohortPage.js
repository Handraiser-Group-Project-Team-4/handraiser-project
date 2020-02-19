import React, { createContext, useState, useEffect, useContext } from "react";
import { useSnackbar } from "notistack";
import io from "socket.io-client";
import Axios from "axios";
import SwipeableViews from "react-swipeable-views";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

// COMPONENTS
import MainpageTemplate from "../../tools/MainpageTemplate";
import Helps from "./Help";
import NeedHelps from "./NeedHelp";
import BeingHelps from "./BeingHelp";
import Chat from "../../Chat/Chat";
import jwtToken from "../../tools/assets/jwtToken";
import { DarkModeContext } from "../../../App";
import Search from "./CohortFilter";

// MATERIAL-UI
import {
  makeStyles,
  useTheme,
  fade,
  Hidden,
  Typography,
  IconButton,
  Paper,
  Avatar,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  TextField,
  InputAdornment,
  Chip,
  AppBar,
  Tabs,
  Tab,
  Box,
  CardMedia,
  Button,
  Fab
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Menu from "@material-ui/core/Menu";
import FaceIcon from "@material-ui/icons/Face";

// ICONS
import SearchIcon from "@material-ui/icons/Search";
import cohort from "../../../images/cohort.png";
import cohortDark from "../../../images/cohortdark.jpg";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

export const UserContext = createContext(null);
let socket;

export default function CohortPage({ value = 0, match }) {
  const ENDPOINT = "localhost:3001";
  const classes = useStyles();
  const history = useHistory();
  const userObj = jwtToken();
  const { id } = match.params;
  const [data, setData] = useState([]);
  const [user, setUser] = useState();
  const [search, setSearch] = useState();
  const [filter, setFilter] = useState();
  const [chatroom, setChatRoom] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { darkMode } = useContext(DarkModeContext);

  const theme = useTheme();
  const inputLabel = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    Axios({
      method: "get",
      url: `/api/users/${userObj.user_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        setUser(res.data);
      })
      .catch(err => {
        console.log(err);
      });
       // ACCESS KEY
       Axios({
      	method: `get`,
      	url: `/api/cohort-check/${id}?user_id=${userObj.user_id}`,
      	headers: {
      		Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
      	}
      })
      	.then(res => {
      		if (res.data.length === 0) {
      			history.push(`/student-page`);
      		}
      	})
      	.catch(err => {
      		console.log(err);
      	});
  }, []);

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
    socket.emit("joinConcern", { id }, () => {});
  }, [ENDPOINT]);

  useEffect(() => {
    socket.emit("getChatroom", { id }, () => {
      socket.on("chatroomData", ({ data }) => {
        data.length &&
        (data[0].mentor_id === userObj.user_id ||
          data[0].student_id === userObj.user_id)
          ? setChatRoom({
              room: data[0].concern_id,
              concern: data[0].concern_title
            })
          : setChatRoom();
      });
    });

    socket.on("concernData", ({ concern, alert }) => {
      setData([...concern]);
      alert &&
        enqueueSnackbar(`${alert.name + " " + alert.action}`, {
          variant: alert.variant,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right"
          }
        });
    });
    return () => {
      socket.emit("disconnectConcern", () => {});
      socket.off();
    };
  }, [data]);

  const changeHandler = event => {
    event.target.name === "search" && setSearch(event.target.value);
    event.target.name === "sortBy" && setFilter(event.target.value);
  };

  const chatHandler = (event, value) => {
    event.stopPropagation();
    setChatRoom(value);
  };
  const handleConcernCount = value => {
    if (value === "allConcern") {
      let concernCount = data.filter(
        concern =>
          concern.concern_status !== "done" && concern.class_id === parseInt(id)
      );
      return concernCount.length;
    } else {
      let concernCount = data.filter(
        concern =>
          concern.concern_status === value && concern.class_id === parseInt(id)
      );
      return concernCount.length;
    }
  };

  return (
    <MainpageTemplate>
      <div className={classes.parentDiv}>
        <UserContext.Provider
          value={{
            id,
            chatroom,
            setChatRoom,
            data,
            setData,
            user,
            setUser,
            chatHandler,
            search,
            filter,
						setFilter,
            handleConcernCount
          }}
        >
          <div className={classes.tabRoot}>
            {/* <IconButton aria-label="back" style={{ position: "absolute" }}>
              <ArrowBackIosIcon />
            </IconButton> */}

            <AppBar position="static" color="default">
              <Button
                style={{
                  position: "absolute",
                  zIndex: 1,
                  top: 5,
                  marginLeft: 5
                }}
                color="default"
                className={classes.button}
                startIcon={<ArrowBackIosIcon />}
              >
                Back
              </Button>
              <Tabs
                value={value}
                // onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab
                  label="Handraiser"
                  onClick={() => history.push(`/cohort/${id}`)}
                />
                <Tab
                  label="Cohort Details"
                  onClick={() => history.push(`/cohort/details/${id}`)}
                />
                <Tab
                  label="Logs"
                  onClick={() => history.push(`/cohort/log/${id}`)}
                />
              </Tabs>
            </AppBar>
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              style={{
                height: "calc(100vh - 48px)"
              }}
              // onChangeIndex={handleChangeIndex}
            >
              <TabPanel
                value={value}
                index={0}
                dir={theme.direction}
                className={classes.TabPanelpaperr}
              >
                <Paper className={classes.paperr} elevation={2}>
                  <Grid
                    container
                    spacing={0}
                    className={classes.gridContainerr}
                    style={{
                      backgroundColor: darkMode ? "#333" : null
                    }}
                  >
                    <Grid
                      item
                      sm={12}
                      md={12}
                      xs={12}
                      lg={6}
                      className={classes.gridItemm}
                    >
                      <Grid container spacing={0} className={classes.topNavi}>
                        <Typography
                          variant="h4"
                          noWrap
                          className={classes.typoTitle}
                        >
                          Handraiser Queue
                          <Chip
                            className={classes.largeChip}
                            label={handleConcernCount("allConcern")}
                          />
                        </Typography>
                        <FormControl
                          variant="outlined"
                          className={classes.formControl}
                        >
                          <InputLabel
                            ref={inputLabel}
                            id="demo-simple-select-outlined-label"
                          >
                            Sort By
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            name="sortBy"
                            defaultValue={"all"}
                            onChange={changeHandler}
                            labelWidth={20}
                            size="small"
                          >
                            <MenuItem value={"all"}>All</MenuItem>
                            <MenuItem value={"done"}>Closed</MenuItem>
                          </Select>
                        </FormControl>
                        <form
                          noValidate
                          autoComplete="off"
                          className={classes.searchform}
                        >
                          <TextField
                            id="outlined-search"
                            label="Search field"
                            type="search"
                            name="search"
                            variant="outlined"
                            onChange={changeHandler}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                              )
                            }}
                          />
                        </form>
                      </Grid>
                      <div>
                        {search || filter === "done" ? (
                          <Search classes={classes} />
                        ) : (
                          <div>
                            <NeedHelps classes={classes} />
                            <BeingHelps classes={classes} />
                          </div>
                        )}
                      </div>
                    </Grid>
                    <Hidden mdDown>
                      <Grid
                        item
                        sm={12}
                        xs={12}
                        md={12}
                        lg={6}
                        className={classes.gridItemm}
                      >
                        <section className={classes.rootq}>
                          {chatroom ? (
                            <Chat />
                          ) : (
                            userObj.user_role_id === 3 && <Helps />
                          )}
                        </section>
                      </Grid>
                    </Hidden>
                  </Grid>
                  <Hidden lgUp>
                    <Helps fab={true} classes={classes} />
                  </Hidden>
                </Paper>
              </TabPanel>
              <TabPanel
                value={value}
                index={1}
                dir={theme.direction}
                className={classes.TabPanelpaperr}
              >
                <Paper className={classes.paperr} elevation={2} style={{
                      backgroundColor: darkMode ? "#333" : null
                    }}>
                  <Grid
                    container
                    spacing={0}
                    className={classes.gridContainerr + " " + classes.banner}
                    style={{
                      backgroundColor: darkMode ? "#333" : null
                    }}
                  >
                    <Grid
                      container
                      item
                      xs={12}
                      sm={12}
                      md={8}
                      lg={8}
                      className={classes.loginBoxGridOne}
                    >
                      <Grid item xs={12} sm={12} md={12} lg={6}>
                        <CardMedia
                          className={classes.loginBoxGridOneCardMedia}
                          image={darkMode ? cohortDark : cohort}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={6}
                        className={classes.gridDetails}style={{
                          backgroundColor: darkMode ? "#333" : null
                        }}
                      >
                        <h1>Computer Programming I</h1>
                        <h6
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            paddingBottom: 10
                          }}
                        >
                          <span>
                            Cohort Code: <Chip label="******" />
                            <IconButton
                              color="primary"
                              aria-label="upload picture"
                              component="span"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </span>
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            style={{ height: 30 }}
                          >
                            Leave Group
                          </Button>
                        </h6>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={0}
                      className={classes.gridContainerr + " " + classes.banner}
                      style={{
                        backgroundColor: darkMode ? "#333" : null
                      }}
                    >
                      <Grid
                        container
                        item
                        xs={12}
                        sm={12}
                        md={8}
                        lg={8}
                        className={classes.lest}
                      >
                        <form
                          noValidate
                          autoComplete="off"
                          className={classes.searchform}
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center"
                          }}
                        >
                          <TextField
                            id="outlined-search"
                            label="Search field"
                            type="search"
                            name="search"
                            variant="outlined"
                            onChange={changeHandler}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                              )
                            }}
                          />
                        </form>
                        {/* <h1 style={{ margin: 0 }}>Mentor</h1> */}
                        <Lest>
                          <ul className={classes.lestUl}>
                            <li
                              className="list"
                              style={{
                                padding: 10,
                                textTransform: "uppercase",
                                backgroundColor: darkMode ? "#333" : null
                              }}
                            >
                              <div
                                className="list__profile"
                                style={{ width: "71%" }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    width: "17%",
                                    justifyContent: "center",
                                    alignItems: "center"
                                  }}
                                >
                                  Avatar
                                </div>
                                <div>
                                  <img style={{ width: 50 }} src=""></img>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "40%"
                                  }}
                                >
                                  Role
                                </div>
                                <div>
                                  <img style={{ width: 50 }} />
                                </div>
                                <div className="list__label">
                                  <div className="list__label--value">Name</div>
                                </div>
                              </div>
                              <div className="list__photos">
                                <span
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "53%"
                                  }}
                                >
                                  Date Joined
                                </span>
                                <span></span>
                                <span></span>
                                <span
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "45%"
                                  }}
                                >
                                  Actions
                                </span>
                              </div>
                            </li>
                            <li className="list" style={{
                                backgroundColor: darkMode ? "#333" : null
                              }}>
                              <div className="list__profile">
                                <div>
                                  <img src="https://lh4.googleusercontent.com/-t4YjQXwPsnY/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rend54-qWova61cblPQt8mE23er0A/s96-c/photo.jpg" />
                                </div>
                                <div>
                                  <img
                                    style={{
                                      width: 50
                                    }}
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                  }}
                                >
                                  <Chip
                                    icon={<FaceIcon />}
                                    label="Mentor"
                                    color="secondary"
                                  />
                                </div>
                                <div>
                                  <img
                                    style={{
                                      width: 50
                                    }}
                                  />
                                </div>
                                <div className="list__label">
                                  <div className="list__label--value">
                                    <Chip
                                      variant="outlined"
                                      label="Jhon Michael Bolima"
                                      className={classes.listChip}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="list__photos">
                                <span
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                  }}
                                >
                                  April 19, 2003 3:30 AM
                                </span>
                                <span></span>
                                <span></span>
                                <span
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "45%"
                                  }}
                                >
                                  <IconButton
                                    color="primary"
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                    component="span"
                                  >
                                    <ExpandMoreIcon />
                                  </IconButton>
                                  <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                  >
                                    <MenuItem onClick={handleClose}>
                                      Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                      My account
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                      Logout
                                    </MenuItem>
                                  </Menu>
                                </span>
                              </div>
                            </li>
                            <li className="list" style={{
                                backgroundColor: darkMode ? "#333" : null
                              }}>
                              <div className="list__profile">
                                <div>
                                  <img src="https://lh4.googleusercontent.com/-t4YjQXwPsnY/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rend54-qWova61cblPQt8mE23er0A/s96-c/photo.jpg" />
                                </div>
                                <div>
                                  <img
                                    style={{
                                      width: 50
                                    }}
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                  }}
                                >
                                  <Chip
                                    icon={<FaceIcon />}
                                    label="Student"
                                    color="Primary"
                                  />
                                </div>
                                <div>
                                  <img
                                    style={{
                                      width: 50
                                    }}
                                  />
                                </div>
                                <div className="list__label">
                                  <div className="list__label--value">
                                    <Chip
                                      variant="outlined"
                                      label="Diana Geromo"
                                      className={classes.listChip}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="list__photos">
                                <span
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                  }}
                                >
                                  April 19, 2003 3:30 AM
                                </span>
                                <span></span>
                                <span></span>
                                <span
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "45%"
                                  }}
                                >
                                  <IconButton
                                    color="primary"
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                    component="span"
                                  >
                                    <ExpandMoreIcon />
                                  </IconButton>
                                  <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                  >
                                    <MenuItem onClick={handleClose}>
                                      Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                      My account
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                      Logout
                                    </MenuItem>
                                  </Menu>
                                </span>
                              </div>
                            </li>
                          </ul>
                        </Lest>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </TabPanel>
              <TabPanel
                value={value}
                index={2}
                dir={theme.direction}
                className={classes.TabPanelpaperr}
              >
                <Paper className={classes.paperr} elevation={2}>
                  <Grid
                    container
                    spacing={0}
                    className={classes.gridContainerr + " " + classes.banner}
                    style={{
                      backgroundColor: darkMode ? "#333" : null,
                      paddingTop: 0,
                      marginTop: -40
                    }}
                  >
                    <Grid container item xs={12} sm={12} md={5} lg={5}>
                      <form
                        noValidate
                        autoComplete="off"
                        className={classes.searchform}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "flex-end",
                          paddingBottom: 10
                        }}
                      >
                        <TextField
                          id="outlined-search"
                          label="Search field"
                          type="search"
                          name="search"
                          variant="outlined"
                          onChange={changeHandler}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            )
                          }}
                        />
                      </form>
                      <Card className={classes.cardLogs}>
                        <CardContent>
                          <Timeline>
                            <ul className={classes.timeline} >
                              <li className="timeline-item" >
                                <div className="timeline-info">
                                  <span>March 12, 2016</span>
                                </div>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                  <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                  />
                                  <h3 
                                    className="timeline-title" 
                                    style={{
                                      color: darkMode ? "#fff" : null
                                    }}
                                  >
                                    <b>Jhon Michael Bolima</b> updated the
                                    cohort details.
                                  </h3>
                                </div>
                              </li>
                              <li className="timeline-item">
                                <div className="timeline-info">
                                  <span>March 23, 2016</span>
                                </div>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                  <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/1.jpg"
                                  />
                                  <h3 className="timeline-title">
                                    <b>Noe Restum</b> joined the cohort.
                                  </h3>
                                </div>
                              </li>
                              {/* <li className="timeline-item period">
                                <div className="timeline-info"></div>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                  <h2 className="timeline-title">April 2016</h2>
                                </div>
                              </li> */}
                              <li className="timeline-item">
                                <div className="timeline-info">
                                  <span>April 02, 2016</span>
                                </div>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                  <h3 className="timeline-title">
                                    Jake Balbedina left the cohort.
                                  </h3>
                                </div>
                              </li>
                              <li className="timeline-item">
                                <div className="timeline-info">
                                  <span>April 28, 2016</span>
                                </div>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                  <h3 className="timeline-title">
                                    Joven Bandagosa raised a concern
                                  </h3>
                                </div>
                              </li>
                              <li className="timeline-item">
                                <div className="timeline-info">
                                  <span>April 02, 2016</span>
                                </div>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                  <h3 className="timeline-title">
                                    Jake Balbedina left the cohort.
                                  </h3>
                                </div>
                              </li>
                              <li className="timeline-item">
                                <div className="timeline-info">
                                  <span>April 28, 2016</span>
                                </div>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                  <h3 className="timeline-title">
                                    Joven Bandagosa raised a concern
                                  </h3>
                                </div>
                              </li>
                              <li className="timeline-item">
                                <div className="timeline-info">
                                  <span>April 02, 2016</span>
                                </div>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                  <h3 className="timeline-title">
                                    Jake Balbedina left the cohort.
                                  </h3>
                                </div>
                              </li>
                              <li className="timeline-item">
                                <div className="timeline-info">
                                  <span>April 28, 2016</span>
                                </div>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                  <h3 className="timeline-title">
                                    Joven Bandagosa raised a concern
                                  </h3>
                                </div>
                              </li>
                              <li className="timeline-item">
                                <div className="timeline-info">
                                  <span>April 02, 2016</span>
                                </div>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                  <h3 className="timeline-title">
                                    Jake Balbedina left the cohort.
                                  </h3>
                                </div>
                              </li>
                              <li className="timeline-item">
                                <div className="timeline-info">
                                  <span>April 28, 2016</span>
                                </div>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                  <h3 className="timeline-title">
                                    Joven Bandagosa raised a concern
                                  </h3>
                                </div>
                              </li>
                            </ul>
                          </Timeline>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>
              </TabPanel>
            </SwipeableViews>
          </div>
        </UserContext.Provider>
      </div>
    </MainpageTemplate>
  );
}

const useStyles = makeStyles(theme => ({
  parentDiv: {
    [theme.breakpoints.up("md")]: {
      minHeight: "100vh"
    }
  },
  cardHeaderRoot: {
    width: "100%",
    borderRadius: 10,
    display: "flex",
    alignItems: "flex-start",
    "& > div > span:first-of-type": {
      fontSize: 25,
      wordBreak: "break-all"
    },
    "& > div > span:last-of-type": {
      fontSize: 15
    },
    "& > div:last-of-type": {
      alignSelf: "center"
    }
  },
  paperr: {
    height: "100%"
  },
  gridContainerr: {
    paddingBottom: 20,
    backgroundColor: "#F5F5F5",
    height: "100%",
    [theme.breakpoints.up("md")]: {
      height: "100vh"
    },
    [theme.breakpoints.down("md")]: {
      height: "calc(110vh - 64px)",
      width: "100vw"
    },
    height: "calc(100vh - 64px)"
  },
  typoTitle: {
    fontFamily: "'Rubik', sans-serif",
    marginBottom: "1rem",
    fontSize: 26,
    [theme.breakpoints.down("md")]: {
      order: 3
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "10vw",
      order: 3
    }
  },
  formControl: {
    marginRight: 10,
    minWidth: 120,
    [theme.breakpoints.down("md")]: {
      marginBottom: 10
    }
  },
  searchform: {
    [theme.breakpoints.down("md")]: {
      marginBottom: 10,
      marginRight: 10
    }
  },
  gridItemm: {
    height: "100%",
    "&:first-of-type": {
      padding: "3rem 3rem 0"
    },
    [theme.breakpoints.down("md")]: {
      "&:first-of-type": {
        padding: "1rem 1rem 0"
      }
    }
  },
  "@global": {
    body: {
      fontFamily: "'Rubik', sans-serif"
    }
  },
  chatTitle: {
    margin: "0 auto"
  },
  rootq: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh"
  },
  roots: {
    height: "85%"
  },
  avatar: {
    borderRadius: 5,
    width: 70,
    height: 70
  },
  cardRootContent: {
    borderRadius: 10,
    boxShadow: "4px 4px 12px 1px rgba(0, 0, 0, 0.2)",
    lineHeight: 1.5,
    "&:last-of-type": {
      marginTop: 20
    },
    maxHeight: 360,
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "5px",
      height: "8px",
      backgroundColor: "#FFF",
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#673ab7" //'#23232F' //'#0595DD',
      // borderTopRightRadius: 10
    }
  },
  cardRootContentTitle: {
    color: "#673ab7",
    fontFamily: '"Fira Mono", monospace',
    position: "sticky",
    top: 0,
    left: 20,
    width: "-webkit-fill-available",
    height: "auto",
    backgroundColor: "white",
    lineHeight: "50px",
    zIndex: 1,
    marginBottom: 0,
    "&::-webkit-scrollbar": {
      width: "5px",
      height: "8px",
      backgroundColor: "#FFF"
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#673ab7" //'#025279' //'#0595DD'
    }
  },
  beingHelped: {
    background: "#fefefe",
    position: "relative",
    borderRadius: 3,
    padding: "0!important",
    marginBottom: 10
  },
  topNavi: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center"
  },
  search: {
    height: 32,
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200
      }
    }
  },
  largeChip: {
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#673ab7"
  },
  cardRootContentContent: {
    position: "relative"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(7),
    right: theme.spacing(5),
    zIndex: 10,
    boxShadow: "none",
    backgroundColor: "transparent"
  },
  TabPanelpaperr: {
    height: "calc(100vh - 48px)",
    "& > div": {
      padding: 0,
      paddingTop: 1
    }
  },
  chatTitle: {
    margin: "0 auto"
  },
  loginBoxGridOne: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: "#f0f3eb",
    display: "flex",
    justifyContent: "space-between",
    "&>div:first-of-type": {
      width: "52%",
      [theme.breakpoints.down("md")]: {
        height: 300
      }
    },
    [theme.breakpoints.up("md")]: {
      height: "auto"
    }
  },
  loginBoxGridTwo: {
    display: "flex"
  },
  loginBoxGridOneCardMedia: {
    height: "100%",
    borderRadius: 16,
    width: "110%"
  },
  banner: {
    paddingTop: 10,
    display: "flex",
    justifyContent: "center",
    "&>div:first-of-type": {
      borderRadius: 16
    }
  },
  gridDetails: {
    fontFamily: "'Rubik', sans-serif",
    textAlign: "center",
    paddingLeft: "3rem",
    "&>h1": {
      fontSize: "2.5rem",
      color: "#673ab7",
      wordBreak: "break-word",
      marginTop: 0,
      paddingTop: 5,
      [theme.breakpoints.down("md")]: {
        marginBottom: 0
      }
    },
    "&>h6": {
      fontSize: "1rem",
      padding: 0,
      margin: 0
    },
    [theme.breakpoints.down("md")]: {
      height: 125
    }
  },
  lest: {
    display: "flex",
    flexDirection: "column"
  },
  lestUl: {
    padding: 0
  },
  listChip: {
    fontSize: "1rem!important"
  },
  timeline: {
    lineHeight: "1.4em",
    listStyle: "none",
    margin: 0,
    padding: 0,
    width: "100%",
    "& h3": {
      lineHeight: "inherit"
    }
  },
  cardLogs: {
    width: "100%",
    maxHeight: "75vh",
    overflow: "scroll",
    "&::-webkit-scrollbar": {
      width: "5px",
      height: "8px",
      backgroundColor: "#FFF",
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#673ab7" //'#23232F' //'#0595DD',
      // borderTopRightRadius: 10
    }
  }
}));

function TabPanel({ children, value, index, ...other }) {
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}
const Timeline = styled.div`
  h2,
  h3 {
    color: #3d4351;
    margin-top: 0;
  }
  .timeline-item {
    padding-left: 40px;
    position: relative;
  }
  .timeline-item:last-child {
    padding-bottom: 0;
  }
  .timeline-info {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 3px;
    margin: 0 0 0.5em 0;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .timeline-marker {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 5px;
    width: 15px;
  }
  .timeline-marker:before {
    background: #ff6b6b;
    border: 3px solid transparent;
    border-radius: 100%;
    content: "";
    display: block;
    height: 15px;
    position: absolute;
    top: 4px;
    left: 0;
    width: 15px;
    transition: background 0.3s ease-in-out, border 0.3s ease-in-out;
  }
  .timeline-marker:after {
    content: "";
    width: 3px;
    background: #ccd5db;
    display: block;
    position: absolute;
    top: 24px;
    bottom: 0;
    left: 6px;
  }
  .timeline-item:last-child .timeline-marker:after {
    content: none;
  }
  .timeline-item:not(.period):hover .timeline-marker:before {
    background: transparent;
    border: 3px solid #ff6b6b;
  }
  .timeline-content {
    padding-bottom: 5px;
    display: flex;
    align-items: baseline;
  }
  .timeline-content p:last-child {
    margin-bottom: 0;
  }
  .period {
    padding: 0;
  }
  .period .timeline-info {
    display: none;
  }
  .period .timeline-marker:before {
    background: transparent;
    content: "";
    width: 15px;
    height: auto;
    border: none;
    border-radius: 0;
    top: 0;
    bottom: 30px;
    position: absolute;
    border-top: 3px solid #ccd5db;
    border-bottom: 3px solid #ccd5db;
  }
  .period .timeline-marker:after {
    content: "";
    height: 32px;
    top: auto;
  }
  .period .timeline-content {
    padding: 40px 0 70px;
  }
  .period .timeline-title {
    margin: 0;
  }
  .timeline-title {
    font-weight: 300;
    padding-left: 10px;
  }
`;
const Lest = styled.div`
  img {
    width: 75px;
    margin: 7px 5px 5px 5px;
    border-radius: 5px;
  }
  .list {
    display: -webkit-box;
    display: flex;
    background-color: white;
    margin: 10px;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.2);
    -webkit-transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  .list:hover {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25), 0 5px 8px rgba(0, 0, 0, 0.22);
    cursor: pointer;
  }
  .list__profile {
    display: -webkit-box;
    display: flex;
    -webkit-box-flex: 1;
    flex-grow: 1;
    text-align: left;
    -webkit-box-pack: start;
    justify-content: flex-start;
  }
  .list__photos {
    display: -webkit-box;
    display: flex;
    width: 30%;
  }
  .list__photos img {
    width: 100px;
  }
  @media screen and (max-width: 400px) {
    .list__photos img {
      width: 75px;
    }
  }
  .list__label {
    width: 100%;
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    justify-content: center;
  }
  .list__label--header {
    color: #9a9a9a;
  }
  @media screen and (max-width: 650px) {
    .list {
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      flex-direction: column;
    }
    .list__profile {
      -webkit-box-pack: center;
      justify-content: center;
      margin: 10px;
    }
    .list__label {
      width: 170px;
    }
    .list__photos {
      -webkit-box-pack: center;
      justify-content: center;
    }
  }
`;
