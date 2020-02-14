import React, { useState, useEffect } from "react";
import axios from "axios";

// MATERIAL-UI
import MaterialTable from 'material-table';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from "@material-ui/core/Tooltip";

// Components
import AdminModal from '../../tools/AdminModal'
import Attending from '../CohortTools/Attending'

// Icons
import VisibilityIcon from "@material-ui/icons/Visibility";
import WorkIcon from '@material-ui/icons/Work';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';


export default function StickyHeadTable() {
  
  const [users, setUsers] = useState({
    columns: [
      { title: 'Avatar', field: 'firstname',
        render: (rowData) => (
          <div style={{display: `flex`}}>
            <img src={rowData.avatar} width="50" height="50" style={{ borderRadius: `50%`, margin: `0 30px 0 0` }} />
            <p>{rowData.firstname} {rowData.lastname}</p>
          </div>
        )
      },
      { title: 'Role', field: 'user_role_id', headerStyle:{display:`none`}, cellStyle:{display:`none`},
        lookup: { 3:"Student",
                  2:"Mentor"
        }
      },
      { title: "Role", field: 'user_role_id', 
        render: (rowData) =>(
          (rowData.user_role_id === 3) 
           ? <Chip variant="outlined" label="Student" color="primary" avatar={<Avatar>S</Avatar>} />
           : <Chip variant="outlined" label="Mentor" color="secondary" avatar={<Avatar>M</Avatar>} />
          
        ),
        export: false

      },
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
        headerStyle : {
          // border: "none",
          textAlign: "center"

        },
        render: (rowData) => (
        <div style={{
          // backgroundColor: "red",
          display: `flex`,
          alignItems: `center`,
          justifyContent: `space-evenly`,
          // marginRight: 50
        }}>
        <>
         { (rowData.user_role_id===2 )? 
         
          <Tooltip title="Assign as Student">
              <WorkIcon
               onClick={e => openAssignModal(rowData, 3)}
              />
            </Tooltip>
        
        : 
          
          <Tooltip title="Assign as Mentor">
              <WorkOutlineIcon
                onClick={e => openAssignModal(rowData, 2)}
              />
            </Tooltip>
         }</>

            <Tooltip title="View Enrolled Cohorts" style={{margin: `0 0 0 5px`}}>
              <VisibilityIcon
                onClick={e => setAttending({ open: true, data: rowData })}
              />
            </Tooltip>
          </div>  
        )
        
      }
    ],
    data: []
  });
  const [assignModal, setAssignModal] = useState(false)
  const [assignObj, setAssignObj] = useState({})
  const [attending, setAttending] = useState({
    open: false,
    data: ''
  })

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

  const closeAttending = () => {
    setAttending({
      ...attending,
      open: false
    })
  }

  return (
    <React.Fragment>
      {assignModal && (
        <AdminModal
          title={`Are you sure you want to assign ${assignObj.firstname} ${assignObj.lastname} as a ${assignObj.role === 3 ? 'student' : 'mentor'}?`}
          data={assignObj}
          open={assignModal}
          render={renderUsers}
          handleClose={ () => setAssignModal(false)}
          type={'Change User Role'}
        />
      )}

      {attending.open && (
        <Attending
          open={attending.open}
          handleClose={closeAttending}
          data={attending.data} 
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
