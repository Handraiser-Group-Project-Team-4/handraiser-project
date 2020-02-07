import React, { useState, useEffect } from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AdminTable from '../tools/AdminTable'

// Components
// import CreateCohort from "./Actions/CreateCohort";
// import ChangeKey from "./Actions/ChangeKey";
import PopupModal from '../tools/PopupModal'

// Material Icons
import AddIcon from "@material-ui/icons/Add";

const columns = [
  { id: "title", label: "Title", minWidth: 170 },
  { id: "description", label: "Description", minWidth: 170 },
  { id: "key", label: "Key", minWidth: 170 },
  { id: "action", label: "Acttion", minWidth: 170 }
];

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 740
  }
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [cohort, setCohort] = useState([]);
  const [temp, setTemp] = useState([])
  const [moment, setMoment] = useState([])
  const [subject, setSubject] = useState("")
  const [created, setCreated] = useState("")
  const [createCohort, setCreateCohort] = useState(false);
  const [handleValues, sethandleValues] = useState({});
  const [editCohort, setEditCohort] = useState(false);
  const [viewStudBool, setViewStudBool] = useState(false);
  const [joinedStudObj, setJoinedStudObj] = useState({})

  const handleClickOpen = () => {
    setCreateCohort(true);
  };

  const handleClose = () => {
    setCreateCohort(false);
  };

  const openViewStudentsModal = (row) => {
    
    axios({
      method: "get",
      url: `/api/viewJoinedStudents/${row.class_id}`,
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
      }
      // data: body.data
    })
      .then(data => {
        setJoinedStudObj(data.data);
        setSubject(row.class_title)
        setCreated(row.class_created)
        setMoment(data.data)
      })
      .then(()=>{
        setViewStudBool(true)
        
      })
      .catch(err => console.log("object"));
  }

   

  const closeViewStudentsModal = () => {
    setViewStudBool(false)
  }

  useEffect(() => {
    renderCohorts();
  }, []);

  // GET THE COHORT VALUES
  const renderCohorts = () => {
    axios({
      method: "get",
      url: `/api/cohorts`,
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
      }
      // data: body.data
    })
      .then(data => {
        // console.log(data.data);
        setCohort(data.data);
        setTemp(data.data)
      })
      .catch(err => console.log("object"));
  };

  const changeKey = row => {
    sethandleValues(row);
    setEditCohort(true);
  };

  const closeEditCohort = () => {
    setEditCohort(false);
  };

  return (
    <React.Fragment>
      {createCohort && (
        <PopupModal 
          title={'Create Cohort'}
          open={createCohort}
          handleClose={handleClose}
          render={renderCohorts}
          type={'Create Cohort'}
        />
      )}

      {editCohort && (
        <PopupModal 
          title={'Change Key'}
          data={handleValues}
          open={editCohort}
          handleClose={closeEditCohort}
          render={renderCohorts}
          type={'Change Key'}
        />
      )}

      {viewStudBool && (
        <PopupModal 
          open={viewStudBool}
          title={`${subject} Created: ${created}`}
          handleClose={closeViewStudentsModal}
          type={'View Joined'}
          temp={moment}
          setTemp={(filteredContacts) => setMoment(filteredContacts)}
          data={joinedStudObj}
        />
      )}


      <Paper className={classes.root}>
        <AdminTable
          columns={columns}
          temp={temp}
          setTemp={(filteredContacts) => setTemp(filteredContacts)}
          data={cohort}
          type={'cohort'}
          changeKeyFn={changeKey}
          openViewStudentsModal={openViewStudentsModal}
        />
      </Paper>

      <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
}