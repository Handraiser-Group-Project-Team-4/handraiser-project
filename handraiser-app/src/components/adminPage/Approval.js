import React from 'react';
import PropTypes from 'prop-types';

// MATERIAL-UI
import {
  makeStyles,
  Tabs,
  Tab,
  Typography,
  Box,
} from '@material-ui/core/';

// COMPONENTS
import Pending from './tables/Pending';
import Approved from './tables/Approved';
import Disapproved from './tables/Disapproved';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    display: 'flex',
    height: 224,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function VerticalTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root} >
      <Tabs
  
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
        
      >
        <Tab label="For Approval" {...a11yProps(0)} />
        <Tab label="Approved" {...a11yProps(1)} />
        <Tab label="Disapproved" {...a11yProps(2)} />
      </Tabs>
      <TabPanel style={{ width: '100%' }} value={value} index={0}>
        <Pending />
      </TabPanel>
      <TabPanel style={{ width: '100%' }} value={value} index={1}>
        <Approved />
      </TabPanel>
      <TabPanel style={{ width: '100%' }} value={value} index={2}>
        <Disapproved />
      </TabPanel>

    </div>
  );
}
