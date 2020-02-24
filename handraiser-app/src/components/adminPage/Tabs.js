import React from "react";
import PropTypes from "prop-types";

import { makeStyles, Typography, Box } from "@material-ui/core";

// COMPONENTS
import Approval from "./Approval";
import Cohort from "./tables/Cohort";
import Users from "./tables/Users";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    height: "100vh"
  }
}));

export default function AdminTabs({ value }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TabPanel value={value} index="admin-cohorts">
        <Cohort />
      </TabPanel>
      <TabPanel value={value} index="admin-users">
        <Users />
      </TabPanel>
      <TabPanel value={value} index="admin-approval">
        <Approval />
      </TabPanel>
    </div>
  );
}
