import React, { createContext, useState, useEffect, useContext } from "react";
import { useSnackbar } from "notistack";
import io from "socket.io-client";
import axios from "axios";
import SwipeableViews from "react-swipeable-views";
import { useHistory } from "react-router-dom";

// COMPONENTS
import MainpageTemplate from "../../tools/MainpageTemplate";
import Helps from "./Help";
import NeedHelps from "./NeedHelp";
import BeingHelps from "./BeingHelp";
import Chat from "../../Chat/Chat";
import jwtToken from "../../tools/assets/jwtToken";
import { DarkModeContext } from "../../../App";
import Search from "./CohortFilter";
import CohortDetails from "../cohortDetails/CohortDetails";
import Logs from "../cohortLogs/Logs";
import { useStyles, Timeline, Lest } from "./Style";

// MATERIAL-UI
import {
  useTheme,
  Hidden,
  Typography,
  Paper,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  TextField,
  InputAdornment,
  AppBar,
  Tabs,
  Tab,
  Box,
  Button
} from "@material-ui/core";

// ICONS
import SearchIcon from "@material-ui/icons/Search";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ChatResponsive from "../../Chat/ChatResponsive";

export const UserContext = createContext(null);
let socket;

export default function CohortPage({ value = 0, match }) {
  const ENDPOINT = "172.60.63.82:3001";
  const classes = useStyles();
  const history = useHistory();
  const userObj = jwtToken();
  const { id } = match.params;
  const [logs, setLogs] = useState([]);
  const [data, setData] = useState([]);
  const [user, setUser] = useState();
  const [search, setSearch] = useState();
  const [filter, setFilter] = useState();
  const [isTrue, setIsTrue] = useState(false);
  const [chatroom, setChatRoom] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const { darkMode } = useContext(DarkModeContext);

  const theme = useTheme();
  const inputLabel = React.useRef(null);

  useEffect(() => {
    axios({
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
    axios({
      method: `get`,
      url: `/api/cohort-check/${id}?user_id=${userObj.user_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
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
  }, [history, id, userObj.user_id]);

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
    socket.emit("joinConcern", { id }, () => {});
  }, [ENDPOINT, id]);

  useEffect(() => {
    socket.emit("getChatroom", { id }, () => {
      socket.on("chatroomData", ({ data }) => {
        data.length
          ? data[0].mentor_id === userObj.user_id ||
            data[0].student_id === userObj.user_id
            ? setChatRoom({
                room: data[0].concern_id,
                concern: data[0].concern_title,
                concern_status: data[0].concern_status,
                user_id: userObj.user_id,
                avatar: userObj.avatar,
                name: userObj.name
              })
            : data.map(concern => {
                return concern.concern_status !== "pending" &&
                  (concern.student_id === userObj.user_id ||
                    concern.mentor_id === userObj.user_id)
                  ? setChatRoom({
                      room: concern.concern_id,
                      concern: concern.concern_title,
                      concern_status: concern.concern_status,
                      user_id: userObj.user_id,
                      avatar: userObj.avatar,
                      name: userObj.name
                    })
                  : setChatRoom();
              })
          : setChatRoom();
      });
    });

    socket.on("newLog", ({ log }) => {
      setLogs([log, ...logs]);
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
  }, [
    data,
    enqueueSnackbar,
    id,
    logs,
    userObj.user_id,
    userObj.avatar,
    userObj.name
  ]);

  const changeHandler = event => {
    event.target.name === "search" && setSearch(event.target.value);
    event.target.name === "sortBy" && setFilter(event.target.value);
    console.log(event.target.value);
  };

  const chatHandler = (event, value) => {
    event.stopPropagation();
    const obj = {
      room: value.room,
      concern: value.concern,
      concern_status: value.concern_status,
      user_id: userObj.user_id,
      avatar: userObj.avatar,
      name: userObj.name
    };
    setChatRoom(obj);
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
    <MainpageTemplate tabIndex={"student-page"}>
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
            isTrue,
            setIsTrue,
            handleConcernCount
          }}
        >
          <div className={classes.tabRoot}>
            <AppBar position="static" color="default">
              <Hidden mdDown>
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
                  onClick={() => history.push(`/student-page`)}
                >
                  Back
                </Button>
              </Hidden>
              <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab
                  label="Handraiser Queue"
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
                    {chatroom ? (
                      <>
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
                              <Chat chatResponsive={false} />
                            </section>
                          </Grid>
                        </Hidden>
                        <Hidden lgUp>
                          <ChatResponsive />
                        </Hidden>
                      </>
                    ) : (
                      <>
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
                              <Helps />
                            </section>
                          </Grid>
                        </Hidden>
                        <Hidden lgUp>
                          <Helps fab={true} classes={classes} />
                        </Hidden>
                      </>
                    )}
                  </Grid>
                </Paper>
              </TabPanel>
              <TabPanel
                value={value}
                index={1}
                dir={theme.direction}
                className={classes.TabPanelpaperr}
              >
                <CohortDetails
                  classes={classes}
                  class_id={id}
                  Lest={Lest}
                  changeHandler={changeHandler}
                  search={search}
                />
              </TabPanel>
              <TabPanel
                value={value}
                index={2}
                dir={theme.direction}
                className={classes.TabPanelpaperr}
              >
                <Logs
                  classes={classes}
                  Timeline={Timeline}
                  changeHandler={changeHandler}
                  logs={logs}
                  search={search}
                  id={id}
                  setLogs={setLogs}
                />
              </TabPanel>
            </SwipeableViews>
          </div>
        </UserContext.Provider>
      </div>
    </MainpageTemplate>
  );
}

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
