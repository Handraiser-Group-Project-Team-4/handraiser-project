import React, { useState } from "react";
import MaterialTable from "material-table";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// components
import KickStud from "./KickStud";

// icons
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

export default function PopupModal({
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

  return (
    <>
      {kickbool && (
        <KickStud open={kickbool} handleClose={closeKickModal} row={kickobj} />
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
