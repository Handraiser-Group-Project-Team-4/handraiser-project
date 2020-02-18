import React, { useState, useEffect } from 'react'
import axios from 'axios'
import io from "socket.io-client";

// COMPONENTS
import keyGenerator from './assets/keyGenerator'

// MATERIAL-UI
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@material-ui/core/";

//  ICONS
import EditIcon from "@material-ui/icons/Edit";

let socket;
export default function AdminModal({ title, data, open, handleClose, render, type, id, canDelete }) {
    const ENDPOINT = "localhost:3001";
    const [body, setBody] = useState({
        data:
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

            (type === 'Change User Role')?
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
        console.log(body);
    };

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
        const METHOD =  (type === "approving") ? 'patch' :
                        (type === "disapproving") ? 'patch' :
                        (type === "Create Cohort") ? 'post' :
                        (type === "Change Key") ? 'patch' :
                        (type === "Change User Role") ? 'patch' :
                        (type === 'Toggle Cohort') ? 'patch' :
                        (type === 'Delete Cohort') ? 'delete':
                        (type === 'Kick Student')? 'delete': null

        const URL = (type === 'approving') ? `/api/toapprove/${data.user_id}` :
                    (type === 'disapproving') ? `/api/todisapprove/${data.user_id}` :
                    (type === 'Create Cohort') ? `/api/class` :
                    (type === 'Change Key') ? `/api/class/${data.classroom_id}` :
                    (type === 'Change User Role') ? `/api/assigning/${data.id}` :
                    (type === 'Toggle Cohort') ? `/api/toggleCohort/${data.row.class_id}?toggle_class_status=${data.toggle_class_status}` :
                    (type === 'Delete Cohort') ? `/api/deleteClass/${id}`:
                    (type === 'Kick Student')? `/api/kickstud/${data.user_id}/${data.class_id}`: null

            axios({
                method: METHOD,
                url: URL,
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
                },
                data: body.data
            })
                .then(() => {
                    if(type === 'Change User Role')
                        socket.emit("changeUserRole", { user_id: data.id, user_role_id: data.role });

                    if (type === 'Create Cohort' || type === 'Toggle Cohort' || type === 'Delete Cohort' || type === 'updating')
                        socket.emit("renderCohort", { data: body.data });
                    
                    if (type === 'approving' || type === 'disapproving') 
                        socket.emit("handleRoleRequest", { user_id: data.user_id, approval_status: body.data });
                    

                    if (type === 'Kick Student'){
                        socket.emit("studentKicked", { user_id: data.user_id, class_id: data.class_id });
                        handleClose(data.class_id);
                    }
                    else{ 
                        render()
                        handleClose()
                    }
                })
                .catch(err => console.log(err))
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth='sm'
        >
            {(type === 'approving' || type === 'Kick Student') ?
                <>
                    <DialogTitle id="alert-dialog-title"> {title} </DialogTitle>

                    <DialogContent>

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Disagree
                        </Button>

                        <Button onClick={e => {submitUserData(e)}} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </>
                : (type !== 'approving') ?
                    <form onSubmit={submitUserData}>
                        <DialogTitle id="alert-dialog-title">
                            {title}
                            {/* Are you sure you want to disapprove {data.firstname} {data.lastname} as
                        a mentor? */}
                        </DialogTitle>

                        <DialogContent>
                            {(type === 'disapproving') ?
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

                        <DialogActions>
                            {(type !== 'Delete Cohort')?
                                <>
                                    <Button onClick={handleClose} color="primary">
                                        Disagree
                                    </Button>

                                    <Button type="submit" color="primary" autoFocus>
                                        Agree
                                    </Button>
                                </> 
                            :
                                <>
                                    <Button onClick={handleClose} color="primary">
                                        Disagree
                                    </Button>
                                    
                                    {(canDelete === "yes")?
                                        <Button type="submit" color="primary" autoFocus>
                                            Agree
                                        </Button>
                                    :
                                        <Button onClick={handleClose} color="primary" autoFocus>
                                            Agree
                                        </Button>
                                    }
                                </>
                            }
                        </DialogActions>
                    </form>
                : null
            }
        </Dialog>
    )
}