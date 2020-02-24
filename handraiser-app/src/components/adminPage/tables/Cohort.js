import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

// MATERIAL-UI
import MaterialTable from "material-table";
import {
  Switch,
  Tooltip,
  Button,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem
} from "@material-ui/core/";

// COMPONENTS
import PopupModal from "../../tools/PopupModal";
import CohortModal from "../CohortTools/CohortModal";
import CopyToClipBoard from "../../tools/CopyToClipBoard";

// ICONS
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SchoolIcon from '@material-ui/icons/School';
import EditIcon from '@material-ui/icons/Edit';
import MoreVertIcon from '@material-ui/icons/MoreVert';
// import PopupModal from "../CohortTools/AssignCohort";

let socket;
export default function Cohort() {
  const ENDPOINT = "172.60.63.82:3001";
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [createCohort, setCreateCohort] = useState(false);
  // const [cohortObj, setCohortObj] = useState({})
  const [updateTitleDesc, setUpdateTitleDesc] = useState({
    open: false,
    data: "",
    type: "updating"
  })

  const [toggleCohort, setToggleCohort] = useState({
    open: false
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
    id: "",
    key: "",
    status: ""
  });
  const [table, setTable] = useState({
    columns: [
      { title: "Title", field: "class_title" },
      { title: "Description", field: "class_description" },
      {
        title: "Key",
        field: "class_key",
        render: rowData => (
          <div style={{ display: `flex`, alignItems: `center` }}>
            <p style={{ width: `110px` }}>{rowData.class_key}</p>
            <CopyToClipBoard data={rowData.class_key} />
          </div>
        )
      },
      {
        title: "Status",
        field: "class_status",
        render: rowData =>
          rowData.class_status === "true" ? (
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
          ) : (
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
      {
        title: "Actions",
        headerStyle: {
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

            <Tooltip title="Update Cohort Title/Description">
              <EditIcon
                onClick={e =>
                  setUpdateTitleDesc({
                    ...updateTitleDesc,
                    open: true,
                    data: row
                  })
                }
              />
            </Tooltip>
            
          </div>
        )
      }
    ],
    mobileColumns: [
      {
        title: "Title",
        field: "class_title",
        render: rowData =>
          rowData.class_status === "true" ? (
            <>
              <status-indicator active pulse positive />
              <span> {rowData.class_title}</span>
            </>
          ) : (
            <>
              <status-indicator active pulse negative />
              <span> {rowData.class_title}</span>
            </>
          )
      },
      {
        title: "Key",
        field: "class_key",
        render: rowData => (
          <div style={{ display: `flex`, alignItems: `center` }}>
            <p style={{ width: `90px` }}>{rowData.class_key}</p>
            <CopyToClipBoard data={rowData.class_key} />
          </div>
        )
      },
      {
        field: "class_key",
        width: 50,
        cellStyle: { textAlign: "right" },
        headerStyle: { textAlign: "right" },
        render: rowData => (
          <PopupState variant="popover" popupId="demo-popup-menu">
            {popupState => (
              <React.Fragment>
                <MoreVertIcon {...bindTrigger(popupState)} />

                <Menu {...bindMenu(popupState)}>
                  <MenuItem>
                    Toggle Status
                    <Switch
                      checked={rowData.class_status === "true" ? true : false}
                      onChange={e => {
                        toggleClassFn(rowData);
                      }}
                    />
                  </MenuItem>

                  <MenuItem
                    onClick={e => setChangeKey({ open: true, data: rowData })}
                  >
                    Change Key
                  </MenuItem>

                  <MenuItem onClick={e => openViewStudentsModal(rowData)}>
                    View Joined Users
                  </MenuItem>

                  <MenuItem  onClick={e => setUpdateTitleDesc({...updateTitleDesc, open: true, data: rowData})} >
                    Update Cohort
                  </MenuItem>
              
              </Menu>

              </React.Fragment>
            )}
          </PopupState>
        )
      }
    ],
    data: []
  });

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT]);

  // GET THE COHORT VALUES
  const renderCohorts = useCallback(() => {
    axios({
      method: "get",
      url: `/api/cohorts/`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(data => {
        setTable(prevState => {
          return {
            ...prevState,
            data: data.data
          };
        });
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    renderCohorts();
  }, [renderCohorts]);

  const toggleClassFn = row => {

    axios({
      method: "get",
      url: `/api/viewJoinedStudents/${row.class_id}`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(data => {
        if (data.data.length === 0) {
          setToggleCohort({
            ...toggleClassFn,
            open: true,
            data: row,
            hasUsers: false
          });
        } else {
          setToggleCohort({
            ...toggleClassFn,
            open: true,
            data: row,
            hasUsers: true
          });
         
        }
      })
      .catch(err => console.log("object"));
  }
  
  
  const openViewStudentsModal = row => {
    setSubject({
      title: row.class_title,
      created: row.class_created,
      id: row.class_id,
      key: row.class_key,
      status: row.class_status
    });
   
    // setCohortObj(row)
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

  return (
    <>
      {updateTitleDesc.open && (
        <PopupModal
          open={updateTitleDesc.open}
          data={updateTitleDesc.data}
          titleLen={updateTitleDesc.data.class_title.length}
          descLen={updateTitleDesc.data.class_description.length}
          type={updateTitleDesc.type}
          handleClose={e =>
            setUpdateTitleDesc({ ...updateTitleDesc, open: false })
          }
          render={renderCohorts}
          title={`Update Class Title/Description`}
        />
      )}

      {toggleCohort.open && (
        <PopupModal
          title={
            (toggleCohort.data.class_status === 'true'  && toggleCohort.hasUsers === true) ? `${toggleCohort.data.class_title} still have users on it. Are you sure you want to close this Cohort ?` : 
            (toggleCohort.data.class_status === 'false') ? `Are you sure you want to open ${toggleCohort.data.class_title} Cohort ?` : 
            (toggleCohort.data.class_status === 'true' && toggleCohort.hasUsers === false ) ? `Are you sure you want to close ${toggleCohort.data.class_title} Cohort ?` : null
          }
          open={toggleCohort.open}
          handleClose={e =>
            setToggleCohort({ ...toggleCohort, open: false })
          }
          data={toggleCohort.data}
          render={renderCohorts}
          type={'Toggle Cohort'}
          message={toggleCohort.message}
        />
      )}

      {createCohort && (
        <PopupModal
          title={"Create Cohort"}
          open={createCohort}
          handleClose={() => setCreateCohort(false)}
          render={renderCohorts}
          type={"Create Cohort"}
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
          classKey={subject.key}
          status={subject.status}
          renderViewStudentsTable={renderViewStudentsTable}
          created={subject.created}
        />
      )}

      <MaterialTable
        title={
          <div>
            {matches && <h3>Cohorts</h3>}

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setCreateCohort(true)}
              startIcon={
                <SchoolIcon style={{ display: matches ? null : "none" }} />
              }
              style={{ fontSize: matches ? null : "10px" }}
            >
              Add Cohort
            </Button>
          </div>
        }
        columns={matches ? table.columns : table.mobileColumns}
        data={table.data}
        options={{
          pageSize: 10,
          headerStyle: { textTransform: `uppercase`, fontWeight: `bold` }
        }}
      />
    </>
  );
}
