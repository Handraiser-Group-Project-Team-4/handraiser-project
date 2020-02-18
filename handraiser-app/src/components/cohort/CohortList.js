import React, { useState, useEffect, useContext } from "react";
import SwipeableViews from "react-swipeable-views";
import axios from "axios";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import { DarkModeContext } from "../../App";

// COMPONENTS
import jwtToken from "../tools/assets/jwtToken";
import CohortContainer from "./CohortContainer";
import UsersModal from "../tools/UsersModal";

// MATERIAL-UI
import {
  useTheme,
  TextField,
  useMediaQuery,
  Typography,
  Box,
  InputAdornment
} from "@material-ui/core";

//ICONS
import SearchIcon from "@material-ui/icons/Search";

let socket;
export default function CohortList({ classes, value }) {
  const { darkMode } = useContext(DarkModeContext);
  const theme = useTheme();
  const ENDPOINT = "localhost:3001";
  const userObj = jwtToken();
  const history = useHistory();
  const [cohorts, setCohorts] = useState([]);
  const [search, setSearch] = useState();
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
      renderCohorts();
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  });

  useEffect(() => {
    renderCohorts(value);
    return () => {};
  }, [value]);

  const renderCohorts = () => {
    axios({
      method: `get`,
      url: `/api/cohorts?user_id=${userObj.user_id}&&value=${value}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
        // console.log(res.data)
        setCohorts(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleCohort = x => {
    axios({
      method: `get`,
      url: `/api/cohort-check/${x.class_id}?user_id=${userObj.user_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(res => {
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
        setIsKey({ ...isKey, open: false });
        alert("Congrats you enter the correct Key!");
        history.push(`/cohort/${class_id}`);
      })
      .catch(err => {
        console.log(err);
        setIsKey({ ...isKey, error: true });
      });
  };

  const changeHandler = event => {
    event.target.name === "search" && setSearch(event.target.value);
  };
  return (
    <>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        style={{ backgroundColor: darkMode ? "#333" : null, height: "100%" }}
        // onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <TextField
            id="outlined-search"
            label="Search field"
            type="search"
            size={"small"}
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
          <CohortContainer
            classes={classes}
            handleCohort={handleCohort}
            cohorts={cohorts}
            search={search}
          />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <CohortContainer
            classes={classes}
            handleCohort={handleCohort}
            cohorts={cohorts}
          />
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
        <UsersModal
          fullScreen={fullScreen}
          open={isKey.open}
          data={isKey}
          setData={e => setIsKey({ ...isKey, key: e.target.value })}
          title={`Join ${isKey.classroomObj.class_title}`}
          modalTextContent="To join to this cohort, please enter the cohort key given by your Mentor."
          handleClose={handleClose}
          handleSubmit={() => handleSubmitKey(isKey)}
          type="Enter Key"
          buttonText="Join"
        />
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
