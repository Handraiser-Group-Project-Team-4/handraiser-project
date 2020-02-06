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
import { alterMaterializedView } from "node-pg-migrate/dist/operations/viewsMaterialized";

const columns = [
  { id: "title", label: "Title", minWidth: 170 },
  { id: "description", label: "Description", minWidth: 170 },
  { id: "key", label: "Key", minWidth: 170 },
  { id: "action", label: "Action", minWidth: 170 }
];

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 740
  }
});

export default function Cohort() {
  const classes = useStyles();
  const [cohort, setCohort] = useState([]);
  const [temp, setTemp] = useState([])

  const [createCohort, setCreateCohort] = useState(false);
  const [editCohort, setEditCohort] = useState({
    open: false,
    data: ""
  })
  const [closeCohort, setCloseCohort] = useState({
    open: false,
    data: ""
  })

  useEffect(() => {
    let isCancelled = false;

    if(!isCancelled)
      renderCohorts();
    
    return () => {  
      isCancelled = true
    }
    
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
        console.log(data.data);
        setCohort(data.data);
        setTemp(data.data)
      })
      .catch(err => console.log("object"));
  };

  return (
    <React.Fragment>
      {createCohort && (
        <PopupModal 
          title={'Create Cohort'}
          open={createCohort}
          handleClose={() => setCreateCohort(false)}
          render={renderCohorts}
          type={'Create Cohort'}
        />
      )}

      {editCohort.open && (
        <PopupModal 
          title={'Change Key'}
          data={editCohort.data}
          open={editCohort.open}
          handleClose={() => setEditCohort({...editCohort, open: false})}
          render={renderCohorts}
          type={'Change Key'}
        />
      )}

      {closeCohort.open && (
        <PopupModal 
          title={'Close Cohort'}
          data={closeCohort.data}
          open={closeCohort.open}
          handleClose={() => setCloseCohort({...closeCohort, open: false})}
          render={renderCohorts}
          type={'Close Cohort'}
        />
      )}

      <Paper className={classes.root}>
        <AdminTable
          columns={columns}
          temp={temp}
          setTemp={(filteredContacts) => setTemp(filteredContacts)}
          data={cohort}
          type={'cohort'}
          changeKeyFn={row => setEditCohort({open: true, data: row}) }
          closeCohortFn={row => setCloseCohort({open: true, data: row})}
        />
      </Paper>

      <Fab color="primary" aria-label="add" onClick={() => setCreateCohort(true) }>
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
}