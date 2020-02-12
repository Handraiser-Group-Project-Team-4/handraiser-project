import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

// Components

import AdminTable from '../../tools/AdminTable'
import PopupModal from '../../tools/PopupModal'

const columns = [
  { id: "photo", label: "Photo", minWidth: 170 },
  { id: "title", label: "Name", minWidth: 170 },
  { id: "description", label: "Description", minWidth: 170 },
  { id: "action", label: "Action", minWidth: 170 }
];

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 740
  }
});

let socket;
export default function Pending() {
  const ENDPOINT = "localhost:3001";
  const classes = useStyles();
  const [pending, setPending] = useState([]);
  const [temp, setTemp] = useState([]);

  const [approving, setApproving] = useState({
    open: false,
    data: ""
  })
  const [disapproving, setDisapproving] = useState({
    open: false,
    data: ""
  })

  // const approvingfunc = row => {
  //   setApproving({ open: true, data: row })
  // };

  // const closeApproving = () => {
  //   setApproving({ ...approving, open: false });
  // };

  // const disApprovingfunc = row => {
  //   setDisapproving({ open: true, data: row })
  // }

  // const closeDisApproving = () => {
  //   setDisapproving({ ...disapproving, open: false });
  // };

  useEffect(() => {
      socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
  }, [ENDPOINT]);

  useEffect(() => {
    let isCancelled = false;

    if(!isCancelled)
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
      // data: body.data
    })
      .then(data => {
        console.log(data.data);
        setPending(data.data);
        setTemp(data.data);
      })
      .catch(err => console.log("object"));
  };

  return (
    <React.Fragment>
      {approving.open && (
        <PopupModal
          data={approving.data}
          open={approving.open}
          handleClose={() => setApproving({ ...approving, open: false }) }
          render={renderPending}
          type="approving"
        />
      )}

      {disapproving.open && (
        <PopupModal
          title={`Are you sure you want to disapprove ${disapproving.data.firstname} ${disapproving.data.lastname} as a mentor?`}
          data={disapproving.data}
          open={disapproving.open}
          handleClose={() => setDisapproving({ ...disapproving, open: false }) }
          render={renderPending}
          type="disapproving"
        />
      )}

      <Paper className={classes.root}>
        <AdminTable
          columns={columns}
          temp={temp}
          setTemp={(filteredContacts) => setTemp(filteredContacts)}
          data={pending}
          type={'pending'}

          approvingfunc={row => setApproving({ open: true, data: row }) }
          disApprovingfunc={row => setDisapproving({ open: true, data: row })}
        />

      </Paper>
    </React.Fragment>
  );
}