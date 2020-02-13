import React, { useState } from "react";

// MATERIAL-UI
import MaterialTable from "material-table";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core/";

// COMPONENTS
import KickStud from "./KickStud";
import AdminModal from '../../tools/AdminModal'

// ICONS
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

export default function CohortModal({
  handleClose,
  open,
  data,
  title,
  created,
  renderViewStudentsTable
}) {
  const [kickbool, setKickbool] = useState(false);
  const [kickobj, setKickobj] = useState({});
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
            <status-indicator active pulse positive />
          ),
          false: (
            <status-indicator active pulse negative />
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

  return (
    <>
      {kickbool && (
        // <KickStud open={kickbool} handleClose={closeKickModal} row={kickobj} />
        <AdminModal 
          title={`Are you sure you want to kick ${kickobj.firstname} ${kickobj.lastname}`}
          open={kickbool} 
          handleClose={closeKickModal} 
          data={kickobj}
          type="Kick Student"
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
          />
        </DialogContent>

        <DialogActions>
          {/* <Button onClick={handleClose} color="primary">
                            Disagree
                    </Button>
                        
                        <Button onClick={e => submitUserData(e)} color="primary" autoFocus>
                            Agree
                    </Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
}
