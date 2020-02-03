import React, { useState, useEffect } from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";

// Material Icons
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";

// Components
import ApprovingModal from "./ApprovingModal";
import DisapprovingModal from "./DisapprovingModal";

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

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [approving, setApproving] = useState(false);
  const [disapproving, setDisapproving] = useState(false);
  const [handleId, setHandleId] = useState('')
  const [data, setData] = useState('')
  const [pending, setPending] = useState([]);
  const [temp, setTemp] = useState([]);

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
      url: `http://localhost:4000/api/pending`,
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

  //SEARCH FUNCTION
  const handleSearch = e => {
    const filteredContacts = pending.filter(
      el =>
        el.firstname.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
    );

    setTemp(filteredContacts);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
        <TextField
          label="Search Name"
          onChange={e => handleSearch(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />

        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {temp
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(row => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.user_id}
                    >
                      <TableCell><img src={row.avatar} alt="Smiley face" height="80" width="80"/></TableCell>
                      <TableCell>
                        {row.firstname}, {row.lastname}
                      </TableCell>
                      <TableCell>{row.email}</TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className={classes.button}
                          startIcon={<EditIcon />}
                          onClick={e => approvingfunc(row)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className={classes.button}
                          startIcon={<EditIcon />}
                          onClick={e => disApprovingfunc(row)}
                        >
                          Disapprove
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={pending.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </React.Fragment>
  );
}
