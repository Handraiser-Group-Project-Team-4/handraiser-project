import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

// COMPONENTS
import CopyToClipBoard from "../../tools/CopyToClipBoard";
import jwtToken from "../../tools/assets/jwtToken";
import { DarkModeContext } from "../../../App";
import cohort from "../../../images/cohort.png";
import cohortDark from "../../../images/cohortdark.jpg";
import UsersModal from "../../tools/UsersModal";

// MATERIAL-UI
import {
  IconButton,
  Paper,
  Grid,
  Chip,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  List,
  Typography
} from "@material-ui/core";

// ICONS
import FaceIcon from "@material-ui/icons/Face";
import SearchIcon from "@material-ui/icons/Search";

export default function CohortDetails({
  classes,
  class_id,
  Lest,
  changeHandler,
  search
}) {
  const { enqueueSnackbar } = useSnackbar();
  const userObj = jwtToken();
  const history = useHistory();
  const [classDetails, setClassDetails] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const { darkMode } = useContext(DarkModeContext);
  const [leaveCohort, setLeaveCohort] = useState({
    open: false,
    data: "",
    err: false
  });

  useEffect(() => {
    axios({
      method: `get`,
      url: `/api/class-details/${class_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => setClassDetails(res.data))
      .catch(err => console.log(err));
  }, [class_id]);

  useEffect(() => {
    let filter = [];
    if (search) {
      classDetails.filter(room => {
        const regex = new RegExp(search, "gi");
        return room.firstname.match(regex) || room.lastname.match(regex)
          ? filter.push(room)
          : null;
      });
      setSearchResult(filter);
    } else {
      setSearchResult([]);
    }
  }, [search, classDetails]);

  const handleLeaveCohort = () => {
    if (leaveCohort.data === "Confirm")
      axios({
        url: `/api/kickstud/${userObj.user_id}/${class_id}`,
        method: `delete`,
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("accessToken")
        }
      })
        .then(res => {
          enqueueSnackbar(`You Just Leave on ${classDetails[0].class_title}`, {
            variant: "error"
          });
          history.push(`/`);
        })
        .catch(err => console.log(err));
    else {
      setLeaveCohort({ ...leaveCohort, err: true });
    }
  };
  return (
    <>
      {leaveCohort.open && (
        <UsersModal
          open={leaveCohort.open}
          data={leaveCohort}
          setData={e =>
            setLeaveCohort({ ...leaveCohort, data: e.target.value })
          }
          title={`Are you sure you want to leave this cohort?`}
          modalTextContent="Leaving on this cohort means that you are not allowed to access this cohort anymore. Please type 'Confirm' to leave"
          handleClose={() =>
            setLeaveCohort({ data: "", open: false, err: false })
          }
          handleSubmit={() => handleLeaveCohort()}
          type="Leave Cohort"
          buttonText="LEAVE COHORT"
        />
      )}
      <Paper className={classes.paperr} elevation={2}>
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
            style={{
              backgroundColor: darkMode ? "#303030" : null
            }}
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
              className={classes.gridDetails}
            >
              <h1>{classDetails.length > 0 && classDetails[0].class_title}</h1>

              <h6
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  paddingBottom: 10
                }}
              >
                {userObj.user_role_id === 2 && (
                  <span>
                    Cohort Code: <Chip label="**********" />
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      {/* <VisibilityIcon /> */}

                      <CopyToClipBoard
                        data={classDetails.length && classDetails[0].class_key}
                      />
                    </IconButton>
                  </span>
                )}
                <Button
                  onClick={() => setLeaveCohort({ ...leaveCohort, open: true })}
                  variant="outlined"
                  size="small"
                  color="secondary"
                  style={{ height: 30 }}
                >
                  Leave Cohort
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
                  size={"small"}
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
                    <div className="list__profile" style={{ width: "71%" }}>
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
                        <img style={{ width: 50 }} src="" alt=""></img>
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
                        <img style={{ width: 50 }} alt="" />
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
                    </div>
                  </li>
                  {searchResult.length ? (
                    searchResult.map((user, index) => (
                      <li
                        className="list"
                        key={index}
                        style={{ backgroundColor: darkMode ? "#333" : null }}
                      >
                        <div className="list__profile">
                          <div>
                            <img src={user.avatar} alt="avatar" />
                          </div>
                          <div>
                            <img
                              style={{
                                width: 50
                              }}
                              alt=""
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
                              label={
                                user.user_role_id === 2 ? `Mentor` : `student`
                              }
                              color={
                                user.user_role_id === 2
                                  ? `secondary`
                                  : `primary`
                              }
                            />
                          </div>
                          <div>
                            <img
                              style={{
                                width: 50
                              }}
                              alt=""
                            />
                          </div>
                          <div className="list__label">
                            <div className="list__label--value">
                              <Chip
                                variant="outlined"
                                label={user.firstname + " " + user.lastname}
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
                            {user.date_joined}
                          </span>
                          <span></span>
                          <span></span>
                        </div>
                      </li>
                    ))
                  ) : classDetails.length && !search ? (
                    classDetails.map((user, index) => (
                      <li
                        className="list"
                        key={index}
                        style={{ backgroundColor: darkMode ? "#333" : null }}
                      >
                        <div className="list__profile">
                          <div>
                            <img src={user.avatar} alt="avatar" />
                          </div>
                          <div>
                            <img
                              style={{
                                width: 50
                              }}
                              alt=""
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
                              label={
                                user.user_role_id === 2 ? `Mentor` : `student`
                              }
                              color={
                                user.user_role_id === 2
                                  ? `secondary`
                                  : `primary`
                              }
                            />
                          </div>
                          <div>
                            <img
                              style={{
                                width: 50
                              }}
                              alt=""
                            />
                          </div>
                          <div className="list__label">
                            <div className="list__label--value">
                              <Chip
                                variant="outlined"
                                label={user.firstname + " " + user.lastname}
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
                            {user.date_joined}
                          </span>
                          <span></span>
                          <span></span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <List
                      style={{
                        padding: "40px"
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h6"
                        style={{
                          textAlign: "center",
                          fontWeight: "300"
                        }}
                      >
                        No User Found
                      </Typography>
                    </List>
                  )}
                </ul>
              </Lest>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
