import React, { useState, useEffect } from "react";
import axios from "axios";


import MaterialTable from 'material-table';



export default function Approved() {


  const [approved, setApproved] = useState({
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
    ],
    data: [],
  });

  useEffect(() => {
    let isCancelled = false;

    if (!isCancelled)
      renderApproved();

    return () => {
      isCancelled = true
    }
  }, []);

  const renderApproved = () => {
    axios({
      method: "get",
      url: `/api/user_approval_fetch?user_approval_status_id=1`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(data => {
        console.log(data.data);
        setApproved({ ...approved, data: data.data });
      })
      .catch(err => console.log("object"));
  };

  return (
    <MaterialTable
      title=""
      columns={approved.columns}
      data={approved.data}
      options={{
        pageSize: 10,
        actionsColumnIndex: -1,
        exportButton: true,
        headerStyle: { textTransform: `uppercase`, fontWeight: `bold` }
      }}
    />
  );
}
