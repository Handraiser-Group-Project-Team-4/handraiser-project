import React, { useEffect, useState } from "react";
import copy from "clipboard-copy";
import axios from "axios";
import MaterialTable from "material-table";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

// components
import PopupModal from "../../tools/PopupModal";
import CohortModal from "../CohortTools/CohortModal";

// icons
import FileCopyIcon from '@material-ui/icons/FileCopy';
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SchoolIcon from '@material-ui/icons/School';
import DeleteIcon from '@material-ui/icons/Delete';

export function ToolTipCopy({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          onClose={() => setOpen(false)}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title="Copied to Clipboard"
        >
          <FileCopyIcon
            style={{ cursor: `pointer`, width:`20px` }}
            onClick={() => {
              copy(data)
              setOpen(true);
            }}
          />
        </Tooltip>
      </div>
    </ClickAwayListener>
  )
}

export default function MaterialTableDemo() {
  const [createCohort, setCreateCohort] = useState(false);
  const [deleteCohortObj, setDeleteCohortObj] = useState({
    open: false,
    title: "",
    id: "",
    canDelete: ""
  })
  const [changeKey, setChangeKey] = useState({
    open: false,
    data: ""
  });
  const [viewJoinedModal, setViewJoinedModal] = useState({
    open: false,
    data: ""
  });
  const [subject, setSubject] = useState({
    title: "",
    created: "",
    id: ""
  });
  const [table, setTable] = useState({
    columns: [
      { title: "Title", field: "class_title" },
      { title: "Description", field: "class_description" },
      {
        title: "Key", field: "class_key",
        render: (rowData) => (
          <div style={{ display: `flex`, alignItems:`center` }}>
            <p style={{ width: `110px` }}>{rowData.class_key}</p>
            <ToolTipCopy data={rowData.class_key} />
          </div>
        )
      },
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
        }
      },
      { title: "Actions",
        headerStyle : {
          // border: "none",
          textAlign: "center"

        },
        cellStyle: {
          textAlign: "center"
        },
        render: row => (
          <div
            style={{
              // backgroundColor: "red",
              display: `flex`,
              alignItems: `center`,
              justifyContent: `space-evenly`,
              marginRight: 50
            }}
          >
            <Tooltip title="Toggle Class Status">
              <Switch
                checked={row.class_status === "true" ? true : false}
                onChange={e => {
                  toggleClassFn(row);
                }}
              />
            </Tooltip>

            <Tooltip title="Change Key">
              <VpnKeyIcon
                onClick={e => setChangeKey({ open: true, data: row })}
              />
            </Tooltip>

            <Tooltip title="View Joined Users">
              <VisibilityIcon onClick={e => openViewStudentsModal(row)} />
            </Tooltip>

            <Tooltip title="Delete Cohort">
              <DeleteIcon onClick={e => deleteCohort(row)} />
            </Tooltip>
          </div>
        )
      }
    ],
    data: []
  });

  useEffect(() => {
    renderCohorts();
  }, []);

  // GET THE COHORT VALUES
  const renderCohorts = () => {
    axios({
      method: "get",
      url: `/api/cohorts/`,
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
  };

  const toggleClassFn = data => {
    console.log(data)

    if (data.class_status === "true") {
      axios({
        method: "patch",
        url: `/api/toggleCohort/${data.class_id}`,
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("accessToken")
        },
        data: {
          class_status: false
        }
      })
        .then(() => {
          renderCohorts();
        })
        .catch(err => console.log("object"));
    } else {
      axios({
        method: "patch",
        url: `/api/toggleCohort/${data.class_id}`,
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("accessToken")
        },
        data: {
          class_status: true
        }
      })
        .then(() => {
          renderCohorts();
        })
        .catch(err => console.log("object"));
    }
  };

  const openViewStudentsModal = row => {
    setSubject({
      title: row.class_title,
      created: row.class_created,
      id: row.class_id
    });
    renderViewStudentsTable(row.class_id);
  };

  const renderViewStudentsTable = id => {
    axios({
      method: "get",
      url: `/api/viewJoinedStudents/${id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(data => {
        setViewJoinedModal({
          ...viewJoinedModal,
          data: data.data,
          open: true
        });
      })
      .catch(err => console.log("object"));
  };

  // DELETE
  const deleteCohort = row => {
    axios({
      method: "get",
      url: `/api/viewJoinedStudents/${row.class_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(data => {
        if (data.data.length === 0) {
          setDeleteCohortObj({
            ...deleteCohortObj,
            open: true,
            title: `Are you you want to delete ${row.class_title}`,
            id: row.class_id,
            canDelete: 'yes'
          })
        } else {
          setDeleteCohortObj({
            ...deleteCohortObj,
            open: true,
            title: ` ${row.class_title} still has a users on it.`,
            canDelete: 'no'
          })
        }

      })
      .catch(err => console.log("object"));
  };

  return (
    <>
      {deleteCohortObj.open && (
        <PopupModal
          title={deleteCohortObj.title}
          open={deleteCohortObj.open}
          handleClose={(e) => setDeleteCohortObj({ ...deleteCohort, open: false })}
          id={deleteCohortObj.id}
          render={renderCohorts}
          type={'Delete Cohort'}
          canDelete={deleteCohortObj.canDelete}
        />)}

      {createCohort && (
        <PopupModal
          title={'Create Cohort'}
          open={createCohort}
          handleClose={() => setCreateCohort(false)}
          render={renderCohorts}
          type={'Create Cohort'}
        />
      )}

      {changeKey.open && (
        <PopupModal
          title={"Change Key"}
          data={changeKey.data}
          open={changeKey.open}
          handleClose={() => setChangeKey({ ...changeKey, open: false })}
          render={renderCohorts}
          type={"Change Key"}
        />
      )}

      {viewJoinedModal.open && (
        <CohortModal
          open={viewJoinedModal.open}
          handleClose={() =>
            setViewJoinedModal({ ...viewJoinedModal, open: false })
          }
          data={viewJoinedModal.data}
          title={subject.title}
          id={subject.id}
          renderViewStudentsTable={renderViewStudentsTable}
          created={subject.created}
        />
      )}

      <MaterialTable
        title={<Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => setCreateCohort(true)}
                  startIcon={<SchoolIcon />}
                >
                  New Cohort
                </Button>}
        columns={table.columns}
        data={table.data}
        options={{
          pageSize: 10,
          headerStyle: { textTransform: `uppercase`, fontWeight: `bold` }
        }}
    
      />
    </>
  );
}
