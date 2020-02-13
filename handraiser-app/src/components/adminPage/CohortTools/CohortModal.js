import React, { useState } from "react";
import axios from 'axios';
import MaterialTable, { MTableToolbar } from "material-table";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from '@material-ui/core/Button';

// components
import KickStud from "./KickStud";
import AssingMentor from "./AssignMentor";

// icons
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import SchoolIcon from '@material-ui/icons/School';

export default function PopupModal({
  handleClose,
  open,
  data,
  title,
  created,
  renderViewStudentsTable,
  id
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
          <img
            style={{ height: 36, borderRadius: "50%" }}
            src={rowData.avatar}
            alt="img"
          />
        ),
        export: false
      },
      {
        title: "Role",
        field: "user_role_id",

        lookup: { 3: "Student", 2: "Mentor" }
      },
      { title: "First Name", field: "firstname" },
      { title: "Last Name", field: "lastname" },
      { title: "Email", field: "email" },
      {
        title: "Status",
        field: "user_status",
        export: false,
        lookup: {
          true: (
            <div
              style={{
                height: "15px",
                width: "15px",
                backgroundColor: "green",
                borderRadius: "50%"
              }}
            />
          ),
          false: (
            <div
              style={{
                height: "15px",
                width: "15px",
                backgroundColor: "red",
                borderRadius: "50%"
              }}
            />
          )
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
        <KickStud open={kickbool} handleClose={closeKickModal} row={kickobj} />
      )}

      {assign.open && (
        <AssingMentor 
          open={assign.open}
          handleClose={closeAssignModal} 
          data={assign.data} 
          title={`Assign a mentor to class ${title}`}
          id={id}
          compare={data}
          />
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={false}
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
          {created}
        </DialogTitle>

        <DialogContent>
          <MaterialTable
            title="Editable Example"
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
              exportFileName: title
            }}
            components={{
          Toolbar: props => (
            <div>
              <MTableToolbar {...props} />
              <div style={{ padding: "0px 10px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={e => getMentors(e, id)}
                  startIcon={<SchoolIcon />}
                >
                  Assign a Mentor
                </Button>
              </div>
            </div>
          )
        }}
          />
        </DialogContent>

        <DialogActions>
         
        </DialogActions>
      </Dialog>
    </>
  );
}
