import React, { createContext, useState, useEffect, useContext } from "react";
import { useSnackbar } from "notistack";
import io from "socket.io-client";
import Axios from "axios";
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

// MATERIAL-UI
import {
  makeStyles,
  useTheme,
  fade,
  Hidden,
  Typography,
  useMediaQuery,
  Paper,
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
  Box
} from "@material-ui/core";

// ICONS
import SearchIcon from "@material-ui/icons/Search";

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

  if (Object.keys(data).length === 0) {
    return null;
  }
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
            handleConcernCount
          }}
        >
          <div className={classes.tabRoot}>
            <AppBar position="static" color="default">
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
    "& > div": {
      padding: 0
    }
  },
  chatTitle: {
    margin: "0 auto"
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