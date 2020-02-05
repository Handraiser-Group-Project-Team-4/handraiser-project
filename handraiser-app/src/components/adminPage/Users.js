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

// Components
import Assign from "./Assign"

// Material Icons
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from '@material-ui/icons/FilterList';


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
  const [users, setUsers] = useState([]);
  const [temp, setTemp] = useState([]) 
  const [sorter, setSorter] = useState(false);
  const [assignModal, setAssignModal] = useState(false)
  const [assignObj, setAssignObj] = useState({})

  const openAssignModal = (row, role) => {
    setAssignModal(true);
    setAssignObj({
      id: row.user_id,
      firstname: row.firstname,
      lastname: row.lastname,
      role: role
    })
  }

  const closeAssignModal = () => {
    setAssignModal(false);
  }

  useEffect(() => {
    renderUsers();
  }, []);

  // GET THE Users VALUES
  const renderUsers = () => {
    axios({
      method: "get",
      url: `/api/allusers`,
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
    }
      // data: body.data
    })
      .then(data => {
        console.log(data.data);
        setUsers(data.data);
        setTemp(data.data)
      })
      .catch(err => console.log("err"));
  };

  

  //SEARCH FUNCTION 
  const handleSearch = e => {
    const filteredContacts = users.filter(
      el =>
        el.firstname.toLowerCase().indexOf(e.target.value.toLowerCase()) !==
          -1 ||
          el.lastname.toLowerCase().indexOf(e.target.value.toLowerCase()) !==
          -1   
    );
  
    setTemp(filteredContacts);
  };

  const ascDesc = () => {
    if (sorter) {
      setSorter(false);
    } else {
      setSorter(true);
    }
    filterRole();
  };

  const filterRole = () => {
      if (sorter) {
      axios({
        method: "get",
        url: `/api/asc`,
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
      }
     
      })
        .then(data => {
          setTemp(data.data);
        })
        .catch(() => console.log("err"));
    } else {
      axios({
        method: "get",
        url: `/api/desc`,
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
      }
      
      })
        .then(data => {
          setTemp(data.data);
        })
        .catch(err => console.log("err"));
    }
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
      {assignModal && (
        <Assign
        open ={assignModal}
        renderUsers={renderUsers}
        assignObj={assignObj}
        handleClose={closeAssignModal}
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
                <TableCell key="avatar" style={{ minWidth: "170" }} > </TableCell>
                <TableCell key="name" style={{ minWidth: "170" }} > Name</TableCell>
                <TableCell key="email" style={{ minWidth: "170" }} > Email</TableCell>
                <TableCell key="role" style={{ minWidth: "170" }} > <FilterListIcon onClick = {ascDesc}/> Role</TableCell>
                <TableCell key="action" style={{ minWidth: "170" }} align="center" > Action</TableCell>
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
                      <TableCell><img src={row.avatar} alt="Smiley face" height="80" width="80" /></TableCell>
                      <TableCell>{row.lastname}, {row.firstname}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>
                        {(row.user_role_id===2 )? "Mentor" : "Student"} 
                      </TableCell>
                      <TableCell align="center">
                      {(row.user_role_id===2 )? <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className={classes.button}
                          startIcon={<EditIcon />}
                          onClick={e => openAssignModal(row, 3)}
                        >
                          Assign as Student
                        </Button> 
                        
                        : <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className={classes.button}
                          startIcon={<EditIcon />}
                          onClick={e => openAssignModal(row, 2)}
                        >
                          Assign as Mentor
                        </Button>
                        
                        } 
                        
                        
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
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </React.Fragment>
  );
}
