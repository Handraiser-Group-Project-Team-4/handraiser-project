import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import MaterialTable from 'material-table';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Popper from '@material-ui/core/Popper';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';


// components
import Badger from '../../tools/Badger';

import VisibilityIcon from "@material-ui/icons/Visibility";

const useStyles = makeStyles(theme => ({
  root: {
    width: 500,
  },
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function Disapproved() {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

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
      },
      { title: 'Reason', field: "View", width: 50, cellStyle: {textAlign: "right"}, headerStyle: {textAlign: "right"},
          render: (rowData) => (
            <PopupState variant="popper" popupId="demo-popup-popper">
            {popupState => (
              <div>
               
                  <VisibilityIcon {...bindToggle(popupState)}/>
              
                <Popper {...bindPopper(popupState)} transition>
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                      <Paper>
                        <Typography className={classes.typography}>{rowData.reason_disapproved}</Typography>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </div>
            )}
          </PopupState>
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
    <>
 

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
    </>
  );
}
