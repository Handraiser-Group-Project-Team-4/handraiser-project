import React from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import useMediaQuery from '@material-ui/core/useMediaQuery';

// MATERIAL-UI
import {
  makeStyles,
  Tabs,
  Tab,
  Typography,
  Box,
  useTheme
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function VerticalTabs() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const [page, setPage] = React.useState('');

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const handleChangeMobile = event => {
    setPage(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

 
  return (

    <div className={classes.root} >
      <div style={{display: matches ? "none" : null}}>
      
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
              Select Table
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={page}
              onChange={handleChangeMobile}
              labelWidth={labelWidth}
            >
              <MenuItem value={1}>For Approval</MenuItem>
              <MenuItem value={2}> Approved</MenuItem>
              <MenuItem value={3}>Disapproved</MenuItem>

            </Select>
          </FormControl>
          <br/>

          {(page === "") && (
            <Pending style={{width: '100%'}} />
          )}
        
          {(page === 1) && (
            <Pending style={{width: '100%'}} />
          )}

          {(page === 2) && (
            <Approved style={{width: '100%'}}/>
          )}

          {(page === 3) && (
            <Disapproved style={{width: '100%'}}/>
          )}
        </div> 
      </div> 
            
     <div style={{display: matches ? null : "none"}}  className={classes.root} >       
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
    </div>
  );
}
