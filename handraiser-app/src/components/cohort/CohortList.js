import React, { useState, useEffect, useContext } from "react";
import SwipeableViews from "react-swipeable-views";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { withSnackbar } from 'notistack';
// import io from "socket.io-client";

// COMPONENTS
// import encryptDecrypt from '../tools/assets/encryptDecrypt'
import jwtToken from "../tools/assets/jwtToken";
import CohortContainer from './CohortContainer'
import UsersModal from '../tools/UsersModal'
import {DarkModeContext} from '../../App'

// MATERIAL-UI
import {
  useTheme,
  // TextField,
  useMediaQuery,
  Typography,
  Box
} from "@material-ui/core";

function CohortList({ classes, value, enqueueSnackbar }) {
  const {darkMode}  = useContext(DarkModeContext)
  const theme = useTheme();
  const userObj = jwtToken();
  const history = useHistory();
  const [isKey, setIsKey] = useState({
    key: "",
    open: false,
    classroomObj: {},
    error: false
  });

  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

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
          // const encryptURL = encryptDecrypt('encrypt', `${x.class_id}`)
          // setTimeout(() => {
          //   history.push(`/cohort/${encryptURL}`);
          // }, 600)
                            
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
        // alert(`Welcome to ${isKey.classroomObj.class_title}!`);
        enqueueSnackbar(`Welcome to ${isKey.classroomObj.class_title}!`, {variant: 'success'})
        history.push(`/cohort/${class_id}`);
      })
      .catch(err => {
        console.log(err);
        setIsKey({ ...isKey, error: true });
      });
  };

  return (
    <>
      <SwipeableViews
        style={{backgroundColor:darkMode?'#333':null,height:'100%'}}
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        style={{ backgroundColor: darkMode ? "#333" : null, height: "100%" }}
        // onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <CohortContainer classes={classes} handleCohort={handleCohort} value={value} />

        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <CohortContainer classes={classes} handleCohort={handleCohort} value={value} />
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
          modalTextContent = "To join to this cohort, please enter the cohort key given by your Mentor."
          handleClose={() => setIsKey({ key: "", open: false, classroomObj: {}, error: false })}
          handleSubmit={() => handleSubmitKey(isKey)}
          type="Enter Key"
          buttonText="Join"
        />
      )}
    </>
  );
}

export default withSnackbar(CohortList);

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
