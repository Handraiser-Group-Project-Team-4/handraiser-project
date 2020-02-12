import React, { useState, useEffect } from "react";
import axios from "axios";

import {  Button } from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit";
import MaterialTable from 'material-table';
import { makeStyles } from "@material-ui/core/styles";

// Components
import PopupModal from '../../tools/PopupModal'

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
  const [users, setUsers] = useState({
    columns: [
      { title: 'Avatar', field: 'avatar',
        render: (rowData) => (
          <img src={rowData.avatar} width="50" height="50" style={{ borderRadius: `50%`,}} />
        )
      },
      { title: "Role", field: 'user_role_id', lookup: {3: "Student", 2:"Mentor"} },
      { title: 'Firstname', field: 'firstname' },
      { title: 'Lastname', field: 'lastname' },
      { title: 'Email', field: 'email' },
      { title: "Status", field: "user_status",
        render: (rowData) => (
          (rowData.user_status)? 
            <status-indicator active pulse positive />
          :
            <status-indicator active pulse negative />
        ),
        export: false
      },     
      { title: "Actions",
        render: (rowData) => (
        (rowData.user_role_id===2 )? 
          <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<EditIcon />}
              onClick={e => openAssignModal(rowData, 3)}
          >
              Assign as Student
          </Button> 
        
        : 
          <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<EditIcon />}
              onClick={e => openAssignModal(rowData, 2)}
          >
              Assign as Mentor
          </Button>
        )
      }
    ],
    data: []
  });
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
    })
      .then(data => {
        console.log(data.data);
        setUsers({ ...users, data: data.data });
      })
      .catch(err => console.log("err"));
  };

  return (
    <React.Fragment>
      {assignModal && (
        <PopupModal
          title={`Are you sure you want to assign ${assignObj.firstname} ${assignObj.lastname} as a ${assignObj.role === 3 ? 'student' : 'mentor'}?`}
          data={assignObj}
          open={assignModal}
          render={renderUsers}
          handleClose={ () => setAssignModal(false)}
          type={'users'}
        />
      )}

      <MaterialTable
        title=""
        columns={users.columns}
        data={users.data}
        options={{
          pageSize: 10,
          actionsColumnIndex: -1,
          exportButton: true,
          headerStyle: {textTransform:`uppercase`, fontWeight:`bold`}
        }}
      />
    </React.Fragment>
  );
}
