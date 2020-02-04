import React, { useState, useEffect } from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AdminTable from '../../tools/AdminTable'

const columns = [
  { id: "photo", label: "Photo", minWidth: 170 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 100 }
];

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 440
  }
});

export default function Approved() {
  const classes = useStyles();
  const [approved, setApproved] = useState([]);
  const [temp, setTemp] = useState([]);

  useEffect(() => {
    renderApproved();
  }, []);

  const renderApproved = () => {
    axios({
      method: "get",
      url: `/api/user_approval_fetch?user_approval_status_id=1`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
      // data: body.data
    })
      .then(data => {
        console.log(data.data);
        setApproved(data.data);
        setTemp(data.data);
      })
      .catch(err => console.log("object"));
  };

  return (
    <Paper className={classes.root}>
      <AdminTable
        columns={columns}
        temp={temp}
        setTemp={(filteredContacts) => setTemp(filteredContacts)}
        data={approved}
        type={'approved'}
      />
    </Paper>
  );
}
