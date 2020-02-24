import React from "react";
import { Redirect, useHistory } from "react-router-dom";
// import io from "socket.io-client";

// MATERIAL-UI
import { AppBar, Tabs, Tab } from "@material-ui/core";

// COMPONENTS
import jwtToken from "../tools/assets/jwtToken";
import MainpageTemplate from "../tools/MainpageTemplate";
import CohortList from "../cohort/CohortList";

//STYLES
import useStyles from "./Style";

// let socket;
export default function MentorPage({ value, tabIndex }) {
  // const ENDPOINT = "172.60.63.82:3001";
  const userObj = jwtToken();
  const classes = useStyles();
  const history = useHistory();

  // useEffect(() => {
  //   socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
  // }, [ENDPOINT]);

  // useEffect(() => {
  // 	socket.on('mentorToStudent', user_id => {
  // 		console.log(user_id, userObj.user_id);
  // 		if (userObj.user_id === user_id)
  // 			alert(
  // 				`Your role has been change to Student Please Logout to see the changes!`
  // 			);
  // 	});

  // 	return () => {
  // 		socket.emit('disconnect');
  // 		socket.off();
  // 	};
  // });

  if (userObj) {
    if (userObj.user_role_id === 1) return <Redirect to="/admin-page" />;
    else if (userObj.user_role_id === 3) return <Redirect to="/student-page" />;
  } else return <Redirect to="/" />;

  return (
    <MainpageTemplate tabIndex={tabIndex}>
      <div className={classes.parentDiv}>
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
                label="All Cohorts"
                onClick={() => history.push("/mentor-page")}
              />
              <Tab
                label="My Cohorts"
                onClick={() => history.push("/mentor-page/my-cohort")}
              />
            </Tabs>
          </AppBar>
          <CohortList classes={classes} value={value} mentor={true} />
        </div>
      </div>
    </MainpageTemplate>
  );
}
