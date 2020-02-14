import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

// MATERIAL-UI
import MaterialTable from 'material-table';
import Tooltip from "@material-ui/core/Tooltip";

// COMPONENTS
import AdminModal from '../../tools/AdminModal'

// ICONS
import EditIcon from "@material-ui/icons/Edit";

// Icons
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';



let socket;
export default function Pending() {
  const ENDPOINT = "localhost:3001";


  const [pending, setPending] = useState({
    columns: [
      {
        title: 'User', field: 'firstname',
        render: (rowData) => (
          <div style={{ display: `flex` }}>
            <img src={rowData.avatar} width="50" height="50" style={{ borderRadius: `50%`, margin: `0 30px 0 0` }} />
            <p>{rowData.firstname} {rowData.lastname}</p>
          </div>
        )
      },
      { field: 'lastname', headerStyle: { display: `none` }, cellStyle: { display: `none` }, },
      { title: 'Email', field: 'email' },
      {
        title: "Actions",
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
    data: [],
  });

  const [approving, setApproving] = useState({
    open: false,
    data: ""
  })
  const [disapproving, setDisapproving] = useState({
    open: false,
    data: ""
  })

  useEffect(() => {
    socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
  }, [ENDPOINT]);

  useEffect(() => {
    let isCancelled = false;

    if (!isCancelled)
      renderPending();

    return () => {
      isCancelled = true
    }
  }, []);

  useEffect(() => {
    socket.on("fetchMentorRequest", () => {
      renderPending();
    })

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  })

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
        console.log(data.data);
        setPending({ ...pending, data: data.data });
      })
      .catch(err => console.log("object"));
  };

  return (
    <React.Fragment>
      {approving.open && (
        <AdminModal
          title={`Are you sure you want to assign ${approving.data.firstname} ${approving.data.lastname} as a mentor?`}
          data={approving.data}
          open={approving.open}
          handleClose={() => setApproving({ ...approving, open: false })}
          render={renderPending}
          type="approving"
        />
      )}

      {disapproving.open && (
        <AdminModal
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
        columns={pending.columns}
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