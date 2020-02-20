import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

import MaterialTable from "material-table";
import Tooltip from "@material-ui/core/Tooltip";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

// Components
import PopupModal from '../../tools/PopupModal';
import Badger from '../../tools/Badger';

// Icons
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import MoreVertIcon from '@material-ui/icons/MoreVert';

let socket;
export default function Pending() {
  const ENDPOINT = "localhost:3001";
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [approving, setApproving] = useState({
    open: false,
    data: ""
  });
  const [disapproving, setDisapproving] = useState({
    open: false,
    data: ""
  });
  const [pending, setPending] = useState({
    columns: [
      {
        title: "User",
        field: "firstname",
        render: rowData => (
          <div style={{ display: `flex` }}>
            <img
              src={rowData.avatar}
              width="50"
              height="50"
              alt={rowData.avatar}
              style={{ borderRadius: `50%`, margin: `0 30px 0 0` }}
            />
            <p>
              {rowData.firstname} {rowData.lastname}
            </p>
          </div>
        )
      },
      {
        field: "lastname",
        headerStyle: { display: `none` },
        cellStyle: { display: `none` }
      },
      { title: "Email", field: "email" },
      {
        title: "Actions",
        headerStyle: {
          // border: "none",
          textAlign: "center"
        },
        render: rowData => (
          <div
            style={{
              // backgroundColor: "red",
              display: `flex`,
              alignItems: `center`,
              justifyContent: `space-evenly`
              // marginRight: 50
            }}
          >
            <Tooltip title="Approve">
              <ThumbUpIcon
                onClick={e => setApproving({ open: true, data: rowData })}
              />
            </Tooltip>
            <Tooltip title="Disapprove">
              <ThumbDownIcon
                onClick={e => setDisapproving({ open: true, data: rowData })}
              />
            </Tooltip>
          </div>
        )
      }
    ],

    mobileColumns: [
      {
        title: "Users",
        field: "firstname",
        render: rowData => (
          <div style={{ display: `flex` }}>
            <Badger obj={rowData} />
            <div>
              <p style={{ margin: 0 }}>
                {rowData.firstname} {rowData.lastname}
              </p>
              <div style={{ margin: 0, fontSize: 10 }}>
                <span>{rowData.email}</span>
                <br />
              </div>
            </div>
            </div>
          )
        },
        { field: "Action", width: 50, cellStyle: {textAlign: "right"}, headerStyle: {textAlign: "right"},
          render: (rowData) => (
            <PopupState variant="popover" popupId="demo-popup-menu">
              {popupState => (
                <React.Fragment>
                  
                    <MoreVertIcon {...bindTrigger(popupState)}/>
                

                  <Menu {...bindMenu(popupState)}>
                  

                  <MenuItem  onClick={e => setApproving({ open: true, data: rowData })}>
                    Approve
                  </MenuItem>

                  <MenuItem    onClick={e => setDisapproving({ open: true, data: rowData })}>
                    Disapprove
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
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("fetchMentorRequest", () => {
      renderPending();
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  });

  useEffect(() => {
    let isCancelled = false;

    if (!isCancelled) renderPending();

    return () => {
      isCancelled = true;
    };
  }, []);

  // GET THE COHORT VALUES
  const renderPending = () => {
    axios({
      method: "get",
      url: `/api/user_approval_fetch?user_approval_status_id=2`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(data => {
        // console.log(data.data);
        setPending(prevState => {
          return { ...prevState, data: data.data };
        });
      })
      .catch(err => console.log("object"));
  };

  return (
    <React.Fragment>
      {approving.open && (
        <PopupModal
          title={`Are you sure you want to assign ${approving.data.firstname} ${approving.data.lastname} as a mentor?`}
          data={approving.data}
          open={approving.open}
          handleClose={() => setApproving({ ...approving, open: false })}
          render={renderPending}
          type="approving"
        />
      )}

      {disapproving.open && (
        <PopupModal
          title={`Are you sure you want to disapprove ${disapproving.data.firstname} ${disapproving.data.lastname} as a mentor?`}
          data={disapproving.data}
          open={disapproving.open}
          handleClose={() => setDisapproving({ ...disapproving, open: false })}
          render={renderPending}
          type="disapproving"
        />
      )}

      <MaterialTable
        title=""
        columns={matches ? pending.columns : pending.mobileColumns}
        data={pending.data}
        options={{
          pageSize: 10,
          actionsColumnIndex: -1,
          exportButton: true,
          headerStyle: { textTransform: `uppercase`, fontWeight: `bold` }
        }}
      />
    </React.Fragment>
  );
}
