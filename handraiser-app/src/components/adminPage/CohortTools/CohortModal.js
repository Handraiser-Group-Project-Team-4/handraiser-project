import React, { useState } from "react";
import axios from 'axios';

// MATERIAL-UI
import MaterialTable from "material-table";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from "@material-ui/core/";

// COMPONENTS

import PopupModal from "../../tools/PopupModal";
import AssingMentor from "./AssignMentor";

// ICONS
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
// import VpnKeyIcon from "@material-ui/icons/VpnKey";

export default function CohortModal({
  handleClose,
  open,
  data,
  title,
  created,
  renderViewStudentsTable,
  id,


}) {
  const [kickbool, setKickbool] = useState(false);
  const [kickobj, setKickobj] = useState({});
  const [assign, setAssign] = useState({
    open: false,
    data: '',
  })

  const students = {
    columns: [
      {
        title: "Avatar",
        field: "avatar",
        render: rowData => (
          <div style={{display: `flex`}}>
            <img style={{ borderRadius: `50%`, margin: `0 30px 0 0` }} width="50" height="50" src={rowData.avatar} alt="img" />
            <p>{rowData.firstname} {rowData.lastname}</p>
          </div>
        ),
        export: false
      },
      {
        title: "Role",
        field: "user_role_id",

        lookup: { 3: "Student", 2: "Mentor" }
      },
      { title: "Email", field: "email" },
      {
        title: "Status",
        field: "user_status",
        export: false,
        lookup: {
          true: <status-indicator active pulse positive />,
          false: <status-indicator active pulse negative />
        }
      }
    ]
  };

  const kickModal = row => {
    setKickbool(true);
    setKickobj(row);
  };

  const closeKickModal = id => {
    setKickbool(false);
    renderViewStudentsTable(id);
  };

  const closeAssignModal = id => {

    setAssign({
      ...assign,
      open: false
    })
    renderViewStudentsTable(id)
  }

  const getMentors = (e, id) => {
    e.preventDefault();

      axios({
        method: "get",
        url: `/api/mentors/${id}`,
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("accessToken")
        }
      })
        .then(res => {
          setAssign({
            ...assign,
            data: res.data,
            open: true
          })
        })
        .catch(err => console.log(err));
      
    
  }


  return (
    <>
      
      {kickbool && (
        // <KickStud open={kickbool} handleClose={closeKickModal} row={kickobj} />
        <PopupModal 
          title={`Are you sure you want to kick ${kickobj.firstname} ${kickobj.lastname}`}
          open={kickbool} 
          handleClose={closeKickModal} 
          data={kickobj}
          type="Kick Student"
        />
      )}

      {assign.open && (
        <AssingMentor 
          open={assign.open}
          handleClose={closeAssignModal} 
          data={assign.data} 
          title={title}
          id={id}
          />
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullwidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            
            <div>
              
            </div>  

            <div style={{display:`flex`, alignItems: `center`, flexDirection:`column`, fontWeight: `normal`}}>
              <h4 style={{margin: `0`}}>{title}</h4>
              <h6 style={{margin: `0`}}>Created: {created}</h6>
             
            </div>

            <CloseIcon onClick={handleClose}/>
          
          </div>
        </DialogTitle>

        <DialogContent>
          <MaterialTable
            title={<Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={e => getMentors(e, id)}
                  startIcon={<AddCircleIcon />}
                >
                  Assign a Mentor
                </Button>}
            columns={students.columns}
            data={data}
            actions={[
              {
                icon: () => <HighlightOffIcon />,
                tooltip: `Kick`,
                onClick: (e, data) => kickModal(data)
              }
            ]}
            options={{
              actionsColumnIndex: -1,
              exportButton: true,
              exportFileName: title,
              pageSize: 10,
              headerStyle: { textTransform: `uppercase`, fontWeight: `bold` }
            }}
           
          />
        </DialogContent>

        <DialogActions>
         
        </DialogActions>
      </Dialog>
    </>
  );
}
