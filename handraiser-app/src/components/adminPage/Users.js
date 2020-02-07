import React, { useState, useEffect } from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

// Components
import AdminTable from '../tools/AdminTable'
import PopupModal from '../tools/PopupModal'

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

  const [users, setUsers] = useState([]);
  const [temp, setTemp] = useState([]) 
  const [sorter, setSorter] = useState(false);
  const [assignModal, setAssignModal] = useState(false)
  const [assignObj, setAssignObj] = useState({})

  const openAssignModal = (row, role) => {
    setAssignModal(true);
    setAssignObj({
      id: row.user_id,
      firstname: row.firstname,
      lastname: row.lastname,
      role: role
    })
  }

  const closeAssignModal = () => {
    setAssignModal(false);
  }

  useEffect(() => {
    renderUsers();
  }, []);

  // GET THE Users VALUES
  const renderUsers = () => {
    axios({
      method: "get",
      url: `/api/allusers`,
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
    }
      // data: body.data
    })
      .then(data => {
        console.log(data.data);
        setUsers(data.data);
        setTemp(data.data)
      })
      .catch(err => console.log("err"));
  };

  const ascDesc = () => {
    if (sorter) {
      setSorter(false);
    } else {
      setSorter(true);
    }
    filterRole();
  };

  const filterRole = () => {
    if (sorter) {
      axios({
        method: "get",
        url: `/api/asc`,
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
      }
     
      })
        .then(data => {
          setTemp(data.data);
        })
        .catch(() => console.log("err"));
    } else {
      axios({
        method: "get",
        url: `/api/desc`,
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
      }
      
      })
        .then(data => {
          setTemp(data.data);
        })
        .catch(err => console.log("err"));
    }
  };

  return (
    <React.Fragment>
      {assignModal && (
        <PopupModal 
          title={`Are you sure you want to assign ${assignObj.firstname} ${assignObj.lastname} as a ${assignObj.role === 3?'student':'mentor'}?`}
          data={assignObj}
          open ={assignModal}
          render={renderUsers}
          handleClose={closeAssignModal}
          type={'users'}
        />
      )}

      <Paper className={classes.root}>
        <AdminTable
         temp={temp}
         setTemp={(filteredContacts) => setTemp(filteredContacts)}
         data={users}
         type={'users'}

         ascDescFn={ascDesc}     
         openAssignModalFn={openAssignModal}   
        />
      </Paper>
    </React.Fragment>
  );
}
