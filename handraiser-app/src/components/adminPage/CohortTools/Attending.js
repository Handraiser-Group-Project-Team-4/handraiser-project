import React, { useState, useEffect } from "react";
import axios from 'axios';
import MaterialTable from "material-table";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from '@material-ui/core/Button';

// components
import AttendingKickModal from "./AttendingKickModal";
import AssignCohort from "./AssignCohort";

// icons
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import SchoolIcon from '@material-ui/icons/School';


export default function AttendingModal({open, data, handleClose}) {
    const [removeObj, setRemoveObj] = useState({
        open: false,
        data: ''
    })
    const [assignCohortObj, setAssignCohortObj] = useState({
      open: false,
      data: ''
    })
    const [table, setTable] = React.useState({
        columns: [
          { title: 'Title', field: 'class_title' },
          { title: 'Description', field: 'class_description' },
          { title: 'Date Joined', field: 'date_joined' },
          {
            title: "Status",
            field: "class_status",
            lookup: {
              true: (
                <span
                  style={{
                    background: `green`,
                    color: `white`,
                    padding: `2px 4px`,
                    borderRadius: `3px`
                  }}
                >
                  active
                </span>
              ),
              false: (
                <span
                  style={{
                    background: `red`,
                    color: `white`,
                    padding: `2px 4px`,
                    borderRadius: `3px`
                  }}
                >
                  close
                </span>
              )
            },
            export: false
          },
          { title: 'Date Cohort Created', field: 'class_created' },  
          
         
        ],
        data: [],
      });


   useEffect(() => {
     renderDataTable(data)  
   }, [])

   const renderDataTable = (data) => {
    axios({
        method: "get",
        url: `/api/getAttendingCohorts/'${data.user_id}'`,
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("accessToken")
        }
      })
        .then(data => {
        
          setTable({
            ...table,
            data: data.data
          });
        })
        .catch(err => console.log(err));

   }

   const getCohorts = data => {
    // console.log(data)
    axios({
      method: "get",
      url: `/api/getMentors/${data.user_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(data => {
        
        console.log(data.data)
        setAssignCohortObj({
          open: true,
          data: data.data
        });
      })
      .catch(err => console.log(err));

   }

   const cloeseKickModal = (data) => {
        renderDataTable(data)
        setRemoveObj({...removeObj, open: false})
   }

   const cloeseAssignModal = (data) => {
    renderDataTable(data)
    setAssignCohortObj({...assignCohortObj, open: false})
}

  
   return (
    <>
      {removeObj.open && (
          <AttendingKickModal
            open = {removeObj.open}
            data = {removeObj.data}
            handleClose = {cloeseKickModal}
            userObj = {data}
         />
      )}

      {assignCohortObj.open && (
        <AssignCohort
          open={assignCohortObj.open}
          data={assignCohortObj.data}
          handleClose={()=>cloeseAssignModal(data)}
          userId={data.user_id}
          title={`${data.firstname} ${data.lastname}`}
        />)}


      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">
            <div style={{display: 'flex'}}>
                <img src={data.avatar} width="50" height="50" style={{ borderRadius: `50%`, margin: `0 10px 0 0`, border: `5px solid #673ab7` }} />
                
                <div>
                    <h5 style={{margin:`0`}}> {data.firstname} {data.lastname}</h5>
                    <div style={{display: 'flex', alignItems: 'baseline'}}>
                    { (data.user_status)? <status-indicator active pulse positive /> : <status-indicator active pulse negative />}
                    {(data.user_role_id === 3 ) ? <h6 style={{margin:`0 0 0 10px`}}>Student</h6> : <h6 style={{margin: `0 0 0 10px`}}>Mentor</h6>}
                    </div>
                    
                </div>
            </div>
           
        </DialogTitle>

        <DialogContent>
            <MaterialTable
                title={<Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={(e) => getCohorts(data)}
                  startIcon={<SchoolIcon />}
                >
                  Assign in a Cohort
                </Button>}
                columns={table.columns}
                data={table.data}
                options={{
                    selection: true,
                    exportButton: true,
                    exportFileName: `${data.firstname} ${data.lastname}'s Enrolled Cohorts `,
                    pageSize: 10,
                    headerStyle: { textTransform: `uppercase`, fontWeight: `bold` }
                }}
                actions={[
                    {
                    tooltip: 'Assign as a Mentor',
                    icon: () => <HighlightOffIcon/>,
                    onClick: (e, data) => setRemoveObj({open: true, data: data})
                    }
                ]}     
                />
        </DialogContent>

        <DialogActions>
         
        </DialogActions>
      </Dialog>
    </>
  );
}
