import React, { useState } from 'react'

import { makeStyles } from "@material-ui/core/styles";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Button,
    InputAdornment,
    Switch
} from "@material-ui/core"


// Material Icons
import EditIcon from "@material-ui/icons/Edit";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from '@material-ui/icons/FilterList';
import PopupModal from './PopupModal';

const useStyles = makeStyles({
    root: {
        width: "100%"
    },
    container: {
        maxHeight: 740
    }
});

export default function AdminTable({ columns, setTemp, temp, data, type, approvingfunc, disApprovingfunc, changeKeyFn, ascDescFn, openAssignModalFn, openViewStudentsModal, toggleClassFn}) {
    
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [kickStudBool, setKickStudBool] = useState(false);
    const [kickStudObj, setKickStudObj] = useState({})

    const opendKickStudFn = row => {
        setKickStudBool(true)
        setKickStudObj(row)
    }

    const closeKickStudFn = () => {
        setKickStudBool(false)
    }

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

    // const handleChange = event => {
    //     alert(event.target.checked)
    //     // setState({ ...state, [name]: event.target.checked });
    // };

    return (
        <>
            {kickStudBool && (
                <PopupModal
                    title={`Are you sure you want to kick ${kickStudObj.firstname} ${kickStudObj.lastname}`}
                    open={kickStudBool}
                    handleClose = {closeKickStudFn}
                    data={kickStudObj}
                    openViewStudentsModal = {openViewStudentsModal}
                    type={'Kick Stud'}   
                />
            )}

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
                                        style={{ minWidth: column.minWidth, textAlign: (column.id==='action')&&`center` }}
                                    >
                                        {column.label}
                                    </TableCell>
                                )):
                                <>
                                <TableCell key="avatar" style={{ minWidth: "170" }} > </TableCell>
                                <TableCell key="name" style={{ minWidth: "170" }} > Name</TableCell>
                                <TableCell key="email" style={{ minWidth: "170" }} > Email</TableCell>
                               
                                {(type === 'View Joined') 
                                ? 

                                <>
                                <TableCell key="avatar" style={{ minWidth: "170" }} >Date Joined</TableCell>
                                <TableCell key="name" style={{ minWidth: "170" }} > Status</TableCell>
                                <TableCell key="email" style={{ minWidth: "170" }} > Kick</TableCell>
                                </>:
                                <>
                                <TableCell key="role" style={{ minWidth: "170" }} > <FilterListIcon onClick = {ascDescFn}/> Role</TableCell>
                                <TableCell key="action" style={{ minWidth: "170" }} align="center" > Action</TableCell>
                                </>
                                }

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
                                                <TableCell  onClick = {e => openViewStudentsModal(row) }>{row.class_title}</TableCell>
                                                <TableCell>{row.class_description}</TableCell>
                                                <TableCell>{row.class_key}</TableCell>
                                                <TableCell>
                                                    {(row.class_status === "t")?
                                                    <span style={{background:`green`, color:`white`, padding:`2px 4px`, borderRadius:`3px`}}>active</span>
                                                    :<span style={{background:`red`, color:`white`, padding:`2px 4px`, borderRadius:`3px`}}>close</span>}
                                                
                                                </TableCell>
                                                <TableCell style={{display:`flex`, alignItems:`center`, justifyContent:`center`}}>
                                                    {/* <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        className={classes.button}
                                                        startIcon={<EditIcon />}
                                                        onClick={e => changeKeyFn(row)}
                                                    >
                                                        Change Key
                                                    </Button> */}
                                                    <div style={{display:`flex`, flexDirection:`column`, justifyContent:`center`}}>
                                                        <label>Toggle Class</label>
                                                        <Switch
                                                            checked={(row.class_status === "t")?true:false}
                                                            onChange={(e) =>  toggleClassFn(e.target.checked, row)}
                                                        />
                                                    </div>

                                                    <EditIcon 
                                                        style={{color:`blue`, cursor:`pointer`, margin:`30px`}}
                                                        onClick={e => changeKeyFn(row)}
                                                    />
            
                                                    <DeleteOutlineIcon 
                                                        style={{color:`red`, cursor:`pointer`}}
                                                        onClick={() => console.log(row)}
                                                    />
                                                </TableCell>
                                            </>:
                                        
                                        (type === 'View Joined') ?
                                                <>
                                             
                                                <TableCell><img src={row.avatar} alt="Smiley face" height="80" width="80" /></TableCell>
                                                <TableCell>{row.firstname}, {row.lastname}</TableCell>
                                                <TableCell>{row.email}</TableCell>
                                                <TableCell>{row.date_joined}</TableCell>
                                                <TableCell align='center'>
                                                    <div style={{height: "15px", width: "15px", backgroundColor: (row.user_status) ? "green" : "red", borderRadius: "50%"}}/>
                                                   </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        className={classes.button}
                                                        startIcon={<EditIcon />}
                                                        onClick={e => opendKickStudFn(row)}
                                                    >
                                                        Ekis icon
                                                    </Button>
                                                    
                                                 </TableCell>
                                                </>
                                            :null
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