import React, { useState, useEffect } from 'react'
import axios from 'axios'
import io from "socket.io-client";

// COMPONENTS
import keyGenerator from './assets/keyGenerator'
import Attending from '../adminPage/CohortTools/Attending'

// MATERIAL-UI
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@material-ui/core/";

//  ICONS
import EditIcon from "@material-ui/icons/Edit";
import SchoolIcon from '@material-ui/icons/School';

let socket;
export default function PopupModal({ title, data, open, handleClose, render, type, id, canDelete, cohorts, getCohorts, descLen, titleLen }) {
    const ENDPOINT = "localhost:3001";
    const [counter, setCounter] = useState({
        title: '30',
        description: '50',
        updatingTitle: 30 - titleLen,
        updatingDescription: 50 - descLen,
    })
    const [attending, setAttending] = useState({
        open: false,
        data: ''
    })
    const [body, setBody] = useState({
        data:
            (type === 'updating')?
                {
                    class_title: data.class_title,
                    class_description: data.class_description 
                }:
            (type === 'approving') ?
                {
                    user_approval_status_id: 1
                } :

            (type === 'disapproving') ?
                {
                    user_approval_status_id: 3
                } :

            (type === 'Create Cohort') ?
                {
                    class_title: "",
                    class_description: "",
                } :

            (type === 'Change Key') ?
                {
                    class_id: data.class_id,
                    class_key: data.class_key
                } :

            (type === 'Change User Role') ?
                {
                    user_role_id: data.role,
                    user_approval_status_id: 4,
                    reason_disapproved: null
                } : null
    });

    useEffect(() => {
        socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);

        return () => {
            socket.emit("disconnect");
            socket.off();
        };
    }, [ENDPOINT]);

    const closeAttending = () => {
        setAttending({
          ...attending,
          open: false
        })
        getCohorts()
    }
    
    const handleReason = (e) => {
        setBody({
            data: {
                ...body.data,
                [e.target.name]: e.target.value,
                user_approval_status_id: 3
            }
        });
        console.log(body)
    };

    const handleInputs = e => {
        let date = new Date();
        let newDate = date.toLocaleString();
        let key = keyGenerator();
        setBody({
        data: {
            ...body.data,
            [e.target.name]: e.target.value,
            class_created: newDate,
            class_key: key,
            class_status: "true"
        }
        });
        const bawas = e.target.value
        const newBawas = bawas.length
        if(e.target.name === 'class_title'){
            setCounter({
                ...counter,
                title: 30-newBawas
            })
        }
        else if(e.target.name === 'class_description'){
            setCounter({
                ...counter,
                description: 50-newBawas
            })
        }
    };

    const updateCohort = e => {
        setBody({
            data:{
                ...body.data,
                [e.target.name]: e.target.value
            }
        })
        const bawas = e.target.value
        const newBawas = bawas.length
        if(e.target.name === 'class_title'){
            setCounter({
                ...counter,
                updatingTitle: 30-newBawas
            })
        }
        else if(e.target.name === 'class_description'){
            setCounter({
                ...counter,
                updatingDescription: 50-newBawas
            })
        }
    }

    const generateKey = () => {
        var result = keyGenerator();

        setBody({
            data: {
                class_id: data.class_id,
                class_key: result
            }
        })
        console.log(body)
    }

    const submitUserData = e => {
        e.preventDefault();
        const METHOD =  (type === "updating") ? 'patch' :
                        (type === "approving") ? 'patch' :
                        (type === "disapproving") ? 'patch' :
                        (type === "Create Cohort") ? 'post' :
                        (type === "Change Key") ? 'patch' :
                        (type === "Change User Role") ? 'patch' :
                        (type === 'Toggle Cohort') ? 'patch' :
                        (type === 'Delete Cohort') ? 'delete' :
                        (type === 'Kick Student') ? 'delete' : null

        const URL = (type === 'updating') ? `/api/updateTitleDesc/${data.class_id}` :
                    (type === 'approving') ? `/api/toapprove/${data.user_id}` :
                    (type === 'disapproving') ? `/api/todisapprove/${data.user_id}` :
                    (type === 'Create Cohort') ? `/api/class` :
                    (type === 'Change Key') ? `/api/class/${data.classroom_id}` :
                    (type === 'Change User Role') ? `/api/assigning/${data.user_id}` :
                    (type === 'Toggle Cohort') ? `/api/toggleCohort/${data.row.class_id}?toggle_class_status=${data.toggle_class_status}` :
                    (type === 'Delete Cohort') ? `/api/deleteClass/${id}` :
                    (type === 'Kick Student') ? `/api/kickstud/${data.user_id}/${data.class_id}` : null

        axios({
            method: METHOD,
            url: URL,
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
            },
            data: body.data
        })
            .then(() => {
                if (type === 'Change User Role')
                    socket.emit("changeUserRole", { user_id: data.user_id, user_role_id: data.role });

                if (type === 'Create Cohort' || type === 'Toggle Cohort' || type === 'Delete Cohort' || type === 'updating')
                    socket.emit("renderCohort", { data: body.data });

                if (type === 'approving' || type === 'disapproving')
                    socket.emit("handleRoleRequest", { user_id: data.user_id, approval_status: body.data });


                if (type === 'Kick Student') {
                    socket.emit("studentKicked", { user_id: data.user_id, class_id: data.class_id });
                    handleClose(data.class_id);
                }
                // else {
                    render()
                    handleClose()
                // }
            })
            .catch(err => console.log(err))
    };

    return (
        <>
            {attending.open && (
                <Attending
                    open={attending.open}
                    handleClose={closeAttending}
                    data={attending.data} 
                    type={'assigning'}
                />
            )}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullwidth=""
                maxWidth='sm'
            >
                 {(type === 'approving' || type === 'Kick Student' || type === 'Change User Role') ?
                    <>
                        <DialogTitle id="alert-dialog-title" >
                            {title}
                            {(type === 'Change User Role') ? 
                                <List component="nav" aria-label="main mailbox folders">
                                {cohorts.map(row => (
                                    <ListItem key={row.class_id}>
                                        <ListItemIcon>
                                        <SchoolIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary={row.class_title} />
                                    </ListItem>
                                ))
                                }
                                </List>
                            :
                            null}
                        </DialogTitle>
                        <DialogContent>
                        </DialogContent>
                        <DialogActions>
                            {(type === 'Change User Role') ?
                                <Button onClick={(e)=>setAttending({ open: true, data: data })} color="secondary" style={{float: 'right'}} autoFocus>
                                    Manage Enrolled Cohorts
                                </Button>
                            : null}   
                            <Button onClick={handleClose} color="primary">
                                Disagree
                            </Button>
                            <Button onClick={e => { submitUserData(e) }} color="primary" autoFocus>
                                Agree
                        </Button>
                        </DialogActions>
                    </>

                    : (type !== 'approving') ?
                        <form onSubmit={submitUserData}>
                            <DialogTitle id="alert-dialog-title">
                                {title}
                            </DialogTitle>

                            <DialogContent>
                                {(type === 'updating') ?
                                    <div style={{ display: `flex`, flexDirection: `column` }}>
                                        <TextField
                                            id="outlined-textarea2"
                                            label="Class Title"
                                            name="class_title"
                                            onChange={updateCohort}
                                            defaultValue={body.data.class_title}
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: <InputAdornment
                                                    style={{
                                                        color: (counter.updatingTitle < 5) ? "red" : null,
                                                        opacity: '0.5'
                                                    }}
                                                    position="end">{counter.updatingTitle}/30</InputAdornment>
                                            }}
                                            inputProps={{
                                                maxLength: 30,
                                            }}
                                        />
                                        <br />
                                        <TextField
                                            id="outlined-textarea1"
                                            label="Class Description"
                                            multiline
                                            name="class_description"
                                            rows="3"
                                            defaultValue={body.data.class_description}
                                            onChange={updateCohort}
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: <InputAdornment
                                                    style={{
                                                        color: (counter.updatingDescription < 10) ? "red" : null,
                                                        opacity: '0.5'
                                                    }}
                                                    position="end">{counter.updatingDescription}/50</InputAdornment>
                                            }}
                                            inputProps={{
                                                maxLength: 50,
                                            }}
                                        />
                                    </div>
                                    : (type === 'disapproving') ?
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="Reason"
                                            multiline
                                            name="reason_disapproved"
                                            rows="4"
                                            onChange={handleReason}
                                            variant="outlined"
                                        />
                                        : (type === 'Create Cohort') ?
                                            <>
                                                <TextField
                                                    id="standard-basic1"
                                                    name="class_title"
                                                    label="title"
                                                    onChange={handleInputs}
                                                />

                                                <TextField
                                                    id="standard-basic2"
                                                    name="class_description"
                                                    label="class_description"
                                                    onChange={handleInputs}
                                                />
                                            </>
                                            : (type === 'Change Key') ?
                                                <>
                                                    <TextField
                                                        id="standard-basic1"
                                                        value={body.data.class_key}
                                                        label="Key"
                                                        InputProps={{
                                                            readOnly: true
                                                        }}
                                                    />

                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        startIcon={<EditIcon />}
                                                        onClick={generateKey}
                                                    >
                                                        Generate New Key
                                        </Button>
                                                </>
                                                : null
                                }
                            </DialogContent>

                            <DialogActions >
                                {(type !== 'Delete Cohort')
                                    ?
                                    <>
                                        {(type === 'Change User Role') ?
                                            <Button onClick={(e)=>setAttending({ open: true, data: data })} color="secondary" style={{float: 'right'}} autoFocus>
                                                Manage Enrolled Cohorts
                                            </Button>
                                            : null}

                                        <Button onClick={(type === "Kick Student") ? (e) => handleClose(data.class_id) : handleClose} color="secondary">
                                            Close
                                            </Button>

                                        <Button type="submit" color="secondary">
                                            Confirm
                                            </Button>
                                    </>
                                    :
                                    <>
                                        <Button onClick={handleClose} color="secondary">
                                            Close
                                        </Button>

                                        {(canDelete === "yes") ?
                                            <Button type="submit" color="secondary" autoFocus>
                                                Confirm
                                            </Button>
                                            :
                                            <Button onClick={handleClose} color="secondary" autoFocus>
                                                Confirm
                                            </Button>
                                        }
                                    </>
                                }
                            </DialogActions>
                        </form>
                        : null
                }
            </Dialog>
        </>
    )
}