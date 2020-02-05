import React, { useState } from 'react'

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";


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

export default function AdminTable({ columns, setTemp, temp, data, type, approvingfunc, disApprovingfunc, changeKeyFn, ascDescFn, openAssignModalFn}) {
    
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    //SEARCH FUNCTION
    const handleSearch = e => {
        const filteredContacts = data.filter(
            el =>
                (type !== 'cohort')?
                    el.firstname.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
                    ||
                    el.lastname.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
                :
                    el.class_title.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1 
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
        <>
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
                            {(columns)?
                                columns.map(column => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                )):
                                <>
                                <TableCell key="avatar" style={{ minWidth: "170" }} > </TableCell>
                                <TableCell key="name" style={{ minWidth: "170" }} > Name</TableCell>
                                <TableCell key="email" style={{ minWidth: "170" }} > Email</TableCell>
                                <TableCell key="role" style={{ minWidth: "170" }} > <FilterListIcon onClick = {ascDescFn}/> Role</TableCell>
                                <TableCell key="action" style={{ minWidth: "170" }} align="center" > Action</TableCell>
                                </>
                            }
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
                                        key={(type !== 'cohort')?row.user_id:row.class_id}
                                    >
                                        {(type === 'pending' || type === 'approved' || type === 'disapproved') ?
                                            <>
                                                <TableCell><img src={row.avatar} alt="Smiley face" height="80" width="80" /></TableCell>
                                                <TableCell>
                                                    {row.firstname}, {row.lastname}
                                                </TableCell>
                                                <TableCell>{row.email}</TableCell>
                                                {(type === 'disapproved') && <TableCell>{row.reason_disapproved}</TableCell>}

                                                {(type === 'pending') &&
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
                                                    </TableCell>}
                                            </>:

                                        (type === 'users') ?
                                            <>
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
                                                    onClick={e => openAssignModalFn(row, 3)}
                                                >
                                                    Assign as Student
                                                </Button> 
                                                
                                                : <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    className={classes.button}
                                                    startIcon={<EditIcon />}
                                                    onClick={e => openAssignModalFn(row, 2)}
                                                >
                                                    Assign as Mentor
                                                </Button>
                                                } 
                                                
                                                
                                                </TableCell>
                                            </>:
                                        
                                        (type === 'cohort') ?
                                            <>
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
                                                        onClick={e => changeKeyFn(row)}
                                                    >
                                                        Change Key
                                                    </Button>
                                                </TableCell>
                                            </>:null
                                        }
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </>
    )
}