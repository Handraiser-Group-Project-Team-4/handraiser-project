import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { useHistory } from "react-router-dom";
import jwtToken from "../tools/assets/jwtToken";
import io from "socket.io-client";
import {
  useMediaQuery,
  Container,
  Grid,
  Card,
  CardActions,
  CardContent,
  Typography,
  Box,
  Button,
  Chip
} from "@material-ui/core";
import Unnamed from "../../images/unnamed.jpg";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import FilledInput from "@material-ui/core/FilledInput";

let socket;
export default function CohortList({ mentor, classes, value }) {
  const theme = useTheme();
  const ENDPOINT = "localhost:3001";
  const userObj = jwtToken();
  const history = useHistory();
  const [cohorts, setCohorts] = useState([]);
  const [isKey, setIsKey] = useState({
    key: "",
    open: false,
    classroomObj: {},
    error: false
  });
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleClose = () => {
    setIsKey({ key: "", open: false, classroomObj: {}, error: false });
  };
  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("fetchCohort", data => {
      // console.log(data)
      // setCohorts([...cohorts, data])
      renderCohorts();
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  });

  useEffect(() => {
    renderCohorts();
    return () => {};
  }, []);

  const renderCohorts = () => {
    axios({
      method: `get`,
      url: "/api/cohorts",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        // console.log(res)
        setCohorts(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleCohort = x => {
    // console.log(`clicked`, x)

    axios({
      method: `get`,
      url: `/api/cohort-check/${x.class_id}?user_id=${userObj.user_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        // console.log(res)
        if (res.data.length === 0) {
          setIsKey({ ...isKey, open: true, classroomObj: x });
        } else {
          history.push(`/cohort/${x.class_id}`);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleSubmitKey = isKey => {
    const input_key = isKey.key;
    const class_id = isKey.classroomObj.class_id;

    let date = new Date();
    let newDate = date.toLocaleString();

    axios({
      method: "post",
      url: `/api/submit-key`,
      data: {
        class_id,
        user_id: userObj.user_id,
        date_joined: newDate,
        input_key
      },
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        // console.log(res)
        setIsKey({ ...isKey, open: false });
        alert("Congrats you enter the correct Key!");
        history.push(`/cohort/${class_id}`);
      })
      .catch(err => {
        console.log(err);
        setIsKey({ ...isKey, error: true });
      });
  };
  {
    /* //////////////////////////////////Old return Code///////////////////////////////////////////////// */
  }
  // return (
  //   <>
  //     {isKey.open && (
  //       <>
  //         <h3>{isKey.classroomObj.class_title}</h3>
  //         <input
  //           type="text"
  //           placeholder="Enter Class key here..."
  //           value={isKey.key}
  //           onChange={e => setIsKey({ ...isKey, key: e.target.value })}
  //         />
  //         {isKey.error && (
  //           <h5 style={{ color: `red`, margin: `0` }}>Invalid Key!</h5>
  //         )}
  //         <div style={{ display: `flex` }}>
  //           <button onClick={() => handleSubmitKey(isKey)}>Submit</button>
  //           <button onClick={() => setIsKey({ ...isKey, open: false })}>
  //             Cancel
  //           </button>
  //         </div>
  //       </>
  //     )}
  //     <div style={{ display: `flex` }}>
  //       {cohorts.map((x, i) => (
  //         <div
  //           onClick={() =>
  //             x.class_status === "t"
  //               ? handleCohort(x)
  //               : alert("Sorry This class is closed")
  //           }
  //           key={i}
  //           style={{
  //             background: `white`,
  //             padding: `20px`,
  //             margin: `10px`,
  //             borderRadius: `5px`,
  //             cursor: `pointer`,
  //             width: `100%`
  //           }}
  //         >
  //           <h3>{x.class_title}</h3>
  //           <p>{x.class_description}</p>
  //           {x.class_status === "t" ? (
  //             <span
  //               style={{
  //                 background: `green`,
  //                 color: `white`,
  //                 padding: `2px 4px`,
  //                 borderRadius: `3px`
  //               }}
  //             >
  //               active
  //             </span>
  //           ) : (
  //             <span
  //               style={{
  //                 background: `red`,
  //                 color: `white`,
  //                 padding: `2px 4px`,
  //                 borderRadius: `3px`
  //               }}
  //             >
  //               close
  //             </span>
  //           )}
  //         </div>
  //       ))}
  //     </div>
  //   </>
  // );
  {
    /* //////////////////////////////////Old return Code End///////////////////////////////////////////////// */
  }
  return (
    <>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        // onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Container className={classes.paperr} maxWidth="xl">
            <Grid container spacing={0} className={classes.gridContainerrr}>
              {cohorts.map((x, i) => (
                <Grid
                  key={i}
                  item
                  xl={4}
                  lg={6}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.rootq}
                >
                  <Card className={classes.cardRoot} elevation={3}>
                    <CardContent>
                      <Grid
                        container
                        spacing={0}
                        className={classes.gridCardContainer}
                      >
                        <Grid item xs={4} className={classes.profile__image}>
                          <img src={Unnamed} alt="Pic" />
                        </Grid>
                        <Grid item xs={8} className={classes.cardDesc}>
                          <div>
                            <h3>{x.class_title}</h3>
                            <p>{x.class_description}</p>
                          </div>
                          <div>
                            <span>
                              <p>Head Mentor</p>
                              <h5>*Aodhan Hayter</h5>
                            </span>
                            <span>
                              <p>Students</p>
                              <h5>*5</h5>
                            </span>
                            <span>
                              <p>Cohort Status</p>
                              <h5>
                                {x.class_status === "t" ? (
                                  <Chip
                                    label="Open"
                                    style={{
                                      backgroundColor: "green",
                                      color: `white`,
                                      marginTop: -5
                                    }}
                                  />
                                ) : (
                                  <Chip
                                    label="Close"
                                    style={{
                                      backgroundColor: "red",
                                      color: `white`,
                                      marginTop: -5
                                    }}
                                  />
                                )}
                              </h5>
                            </span>
                          </div>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions className={classes.cohortCardActions}>
                      <Button
                        size="small"
                        onClick={() =>
                          x.class_status === "t"
                            ? handleCohort(x)
                            : alert("Sorry This class is closed")
                        }
                      >
                        Join Cohort
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Container className={classes.paperr} maxWidth="xl">
            <Grid container spacing={0} className={classes.gridContainerrr}>
              {[1, 2, 3, 4, 5].map(i => (
                <Grid
                  item
                  xl={4}
                  lg={6}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.rootq}
                >
                  <Card className={classes.cardRoot} elevation={3}>
                    <CardContent>
                      <Grid
                        container
                        spacing={0}
                        className={classes.gridCardContainer}
                      >
                        <Grid item xs={4} className={classes.profile__image}>
                          <img src={Unnamed} alt="Pic" />
                        </Grid>
                        <Grid item xs={8} className={classes.cardDesc}>
                          <div>
                            <h3>Boom Camp Frontend Fall 2019</h3>
                            <p>Software Development</p>
                          </div>
                          <div>
                            <span>
                              <p>Head Mentor</p>
                              <h5>Aodhan Hayter</h5>
                            </span>
                            <span>
                              <p>Students</p>
                              <h5>5</h5>
                            </span>
                            <span>
                              <p>Subject</p>
                              <h5>Web Programming</h5>
                            </span>
                          </div>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions className={classes.cohortCardActions}>
                      <Button size="small">Join Cohort</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </TabPanel>
      </SwipeableViews>
      {/* Dialog for creation of Cohort. Do Not delete */}
      {/* <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Join Cohort</DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off">
            <TextField
              id="outlined-full-width"
              label="Label"
              helperText=""
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
            />
            <TextField
              id="outlined-multiline-static"
              label="Multiline"
              multiline
              rows="4"
              variant="outlined"
              helperText=""
              fullWidth
              multiline
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog> */}
      {isKey.open && (
        <Dialog
          fullScreen={fullScreen}
          open={isKey.open}
          onClose={handleClose}
          maxWidth="sm"
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Join {isKey.classroomObj.class_title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              To join to this cohort, please enter the cohort key given by your
              Mentor.
            </DialogContentText>
            <TextField
              autoFocus
              label="Cohort Key"
              id="outlined-full-width"
              helperText=""
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
              value={isKey.key}
              onChange={e => setIsKey({ ...isKey, key: e.target.value })}
              helperText={
                isKey.error ? "The Cohort Key you entered is invalid." : ""
              }
              error={isKey.error}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()} color="primary">
              Cancel
            </Button>
            <Button onClick={() => handleSubmitKey(isKey)} color="primary">
              Join
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
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
