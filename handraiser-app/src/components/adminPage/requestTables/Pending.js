import React, { useState, useEffect } from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AdminTable from '../../tools/AdminTable'

// Components
import ApprovingModal from "../Actions/ApprovingModal";
import DisapprovingModal from "../Actions/DisapprovingModal";

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

export default function Pending() {
  const classes = useStyles();
  const [pending, setPending] = useState([]);
  const [temp, setTemp] = useState([]);

  const [approving, setApproving] = useState(false);
  const [disapproving, setDisapproving] = useState(false);
  const [handleId, setHandleId] = useState('')
  const [data, setData] = useState('')

  const approvingfunc = row => {
    setHandleId(row);
    setApproving(true);
  };

  const closeApproving = () => {
    setApproving(false);
  };

  const disApprovingfunc = row => {
    setData(row)
    setDisapproving(true)
  }

  const closeDisApprovingfunc = () => {
    setDisapproving(false);
  };

  useEffect(() => {
    renderPending();
  }, []);

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
      {approving && (
        <ApprovingModal
          handleId={handleId}
          open={approving}
          handleClose={closeApproving}
          renderPending={renderPending}
        />
      )}

      {disapproving && (
        <DisapprovingModal
          data={data}
          open={disapproving}
          handleClose={closeDisApprovingfunc}
          renderPending={renderPending}
        />
      )}

      <Paper className={classes.root}>
        <AdminTable
          columns={columns}
          temp={temp}
          setTemp={(filteredContacts) => setTemp(filteredContacts)}
          data={pending}
          type={'pending'}

          approvingfunc={approvingfunc}
          disApprovingfunc={disApprovingfunc}
        />

      </Paper>
    </React.Fragment>
  );
}
