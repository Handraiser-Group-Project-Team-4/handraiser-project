import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import MaterialTable from "material-table";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

// components
import Badger from "../../tools/Badger";

export default function Disapproved() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [disapproved, setDisapproved] = useState({
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
              alt={rowData.firstname}
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
      { title: "Reason", field: "reason_disapproved" }
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
      }
    ],
    data: []
  });

  const renderDisapproved = useCallback(() => {
    axios({
      method: "get",
      url: `/api/user_approval_fetch?user_approval_status_id=3`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("accessToken")
      }
    })
      .then(data => {
        console.log(data.data);
        setDisapproved(prevState => {return { ...prevState, data: data.data }});
      })
      .catch(err => console.log("object"));
  }, []);

  useEffect(() => {
    let isCancelled = false;

    if (!isCancelled) renderDisapproved();

    return () => {
      isCancelled = true;
    };
  }, [renderDisapproved]);

  return (
    <MaterialTable
      title=""
      columns={matches ? disapproved.columns : disapproved.mobileColumns}
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
