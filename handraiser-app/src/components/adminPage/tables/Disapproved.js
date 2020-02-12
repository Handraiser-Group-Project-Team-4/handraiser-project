import React, { useState, useEffect } from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from 'material-table';

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  container: {
    maxHeight: 440
  }
});

export default function Disapproved() {
  const classes = useStyles();

  const [disapproved, setDisapproved] = useState({
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
      { title: 'Reason', field: 'reason_disapproved' },
    ],
    data: [],
  });

  useEffect(() => {
    let isCancelled = false;

    if (!isCancelled)
      renderDisapproved();

    return () => {
      isCancelled = true
    }
  }, []);

  const renderDisapproved = () => {
    axios({
      method: "get",
      url: `/api/user_approval_fetch?user_approval_status_id=3`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(data => {
        console.log(data.data);
        setDisapproved({ ...disapproved, data: data.data });
      })
      .catch(err => console.log("object"));
  };

  return (
    <MaterialTable
      title=""
      columns={disapproved.columns}
      data={disapproved.data}
      options={{
        pageSize: 10,
        actionsColumnIndex: -1,
        exportButton: true,
        headerStyle: { textTransform: `uppercase`, fontWeight: `bold` }
      }}
    />
  );
}
