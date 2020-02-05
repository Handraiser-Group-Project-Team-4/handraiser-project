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
import Fab from "@material-ui/core/Fab";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";

// Components
import CreateCohort from "./Actions/CreateCohort";
import ChangeKey from "./Actions/ChangeKey";

// Material Icons
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";


const columns = [
  { id: "title", label: "Title", minWidth: 170 },
  { id: "description", label: "Description", minWidth: 170 },
  { id: "key", label: "Key", minWidth: 170 },
  { id: "action", label: "Acttion", minWidth: 170 }
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
  const [cohort, setCohort] = useState([]);
  const [temp, setTemp] = useState([]) 
  const [handleValues, sethandleValues] = useState({});
  const [createCohort, setCreateCohort] = useState(false);
  const [editCohort, setEditCohort] = useState(false);

  const handleClickOpen = () => {
    setCreateCohort(true);
  };

  const handleClose = () => {
    setCreateCohort(false);
  };

  useEffect(() => {
    renderCohorts();
  }, []);

  // GET THE COHORT VALUES
  const renderCohorts = () => {
    axios({
      method: "get",
      url: `/api/class`,
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
    }
      // data: body.data
    })
      .then(data => {
        console.log(data.data);
        setCohort(data.data);
        setTemp(data.data)
      })
      .catch(err => console.log("object"));
  };

  //SEARCH FUNCTION 
  const handleSearch = e => {
    const filteredContacts = cohort.filter(
      el =>
        el.class_title.toLowerCase().indexOf(e.target.value.toLowerCase()) !==
          -1 
    );
  
    setTemp(filteredContacts);
  };

  const changeKey = row => {
    sethandleValues(row);
    setEditCohort(true);
  };

  const closeEditCohort = () => {
    setEditCohort(false);
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
      {createCohort && (
        <CreateCohort
          open={createCohort}
          handleClose={handleClose}
          renderCohorts={renderCohorts}
        />
      )}

      {editCohort && (
        <ChangeKey
            row={handleValues}
            open={editCohort}
            handleClose={closeEditCohort}
            renderCohorts={renderCohorts}
        />
      )}

      <Paper className={classes.root}>
     
      <TextField
                 label="Search Contact"
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
                      key={row.class_id}
                    >
                      <TableCell>{row.class_title}</TableCell>
                      <TableCell>{row.class_description}</TableCell>
                      <TableCell>{row.class_key}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className={classes.button}
                          startIcon={<EditIcon />}
                          onClick={e => changeKey(row)}
                        >
                          Change Key
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
          count={cohort.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
}
