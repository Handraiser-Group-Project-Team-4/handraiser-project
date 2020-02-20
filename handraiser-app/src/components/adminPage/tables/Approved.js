import React, { useState, useEffect } from "react";
import axios from "axios";

// material ui
import MaterialTable from "material-table";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

// components
import Badger from "../../tools/Badger";

export default function Approved() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [approved, setApproved] = useState({
    columns: [
      {
        title: "User",
        field: "firstname",
        render: rowData => (
          <div style={{ display: `flex` }}>
            <img
              src={rowData.avatar}
              alt={rowData.firstname}
              width="50"
              height="50"
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
      { title: "Email", field: "email" }
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

  useEffect(() => {
    let isCancelled = false;

    if (!isCancelled) renderApproved();

    return () => {
      isCancelled = true;
    };
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
      columns={matches ? approved.columns : approved.mobileColumns}
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
