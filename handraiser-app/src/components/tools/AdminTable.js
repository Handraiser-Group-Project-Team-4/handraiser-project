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


const useStyles = makeStyles({
    root: {
        width: "100%"
    },
    container: {
        maxHeight: 740
    }
});

export default function AdminTable({ columns, setTemp, temp, data, type, approvingfunc, disApprovingfunc, changeKeyFn }) {
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
                                        key={(type !== 'cohort')?row.user_id:row.class_id}
                                    >
                                        {(type !== 'cohort') ?
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
                                            </>
                                            :
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
                                            </>
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
