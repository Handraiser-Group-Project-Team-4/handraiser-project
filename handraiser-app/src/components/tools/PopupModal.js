import React, {useState, useEffect} from 'react'
import axios from 'axios'
import io from "socket.io-client";

import keyGenerator from './assets/keyGenerator'
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";

let socket;
export default function PopupModal({ title, data, open, handleClose, render, type }) {
    const ENDPOINT = "localhost:3001";
    const [body, setBody] = useState({
        data: 
        (type === 'approving')?
            {
                user_approval_status_id: 1
            }:
        
        (type === 'disapproving')?
            {
                user_approval_status_id: 3
            }:
        
        (type === 'Create Cohort')?
            {
                class_title: "",
                class_description: "",
            }:

        (type === 'Change Key')?
            {
                class_id: data.class_id,
                class_key: data.class_key
            }: null
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
            class_status: "t"
        }
        });
        console.log(body);
    };

    const generateKey = () => {
        var result = keyGenerator();

        setBody({
            data:{
                class_id: data.class_id,
                class_key: result
            }
        })
        console.log(body)
    }

    const submitUserData = e => {
        e.preventDefault();
        const METHOD = (type === "Create Cohort")? 'post' : 'patch';
        const URL = (type === 'approving')?`/api/toapprove/${data.user_id}`:
                    (type === 'disapproving')?`/api/todisapprove/${data.user_id}`:
                    (type === 'Create Cohort')?`/api/class`:
                    (type === 'Change Key')?`/api/class/${data.classroom_id}`: 
                    (type === 'users')?`/api/assigning/${data.id}`:
                    (type === 'Toggle Cohort')?`/api/toggleCohort/${data.row.class_id}?toggle_class_status=${data.toggle_class_status}`:null

        if(type === 'users')
            axios({
                method: METHOD,
                url: URL,
                headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
            },
                data: {
                    user_role_id: data.role,
                    user_approval_status_id: 4,
                    reason_disapproved: null
                }
            })
                .then(() => {
                    socket.emit("changeUserRole", {user_id: data.id, user_role_id: data.role});

                    render()
                    handleClose()
                })
                .catch(err => console.log("err"))
        else
            axios({
                method: METHOD,
                url: URL,
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
                },
                data: body.data
            }) 
            .then(() => {
                if(type === 'Create Cohort' || type === 'Toggle Cohort'){
                    socket.emit("renderCohort", {data: body.data});
                }

                if(type === 'approving' || type === 'disapproving'){
                    socket.emit("handleRoleRequest", {user_id: data.user_id, approval_status: body.data});
                }

                handleClose();
                render();
            })
            .catch(err => console.log(err))
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={false}
            maxWidth="xs"
        >
            {(type !== 'approving')?
                <form onSubmit={submitUserData}>
                    <DialogTitle id="alert-dialog-title">
                        {title}
                        {/* Are you sure you want to disapprove {data.firstname} {data.lastname} as
                        a mentor? */}
                    </DialogTitle>

                    <DialogContent>
                        {(type === 'disapproving')?
                            <TextField
                                id="outlined-multiline-static"
                                label="Reason"
                                multiline
                                name="reason_disapproved"
                                rows="4"
                                onChange={handleReason}
                                variant="outlined"
                            />
                         :(type === 'Create Cohort')?
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
                         : (type === 'Change Key')?
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
                        <Button onClick={handleClose} color="primary">
                            Disagree
                        </Button>
                        <Button type="submit" color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </form>
                :
                <>
                    <DialogTitle id="alert-dialog-title"> Are you sure you want to assign {data.firstname} {data.lastname} as a mentor?</DialogTitle>

                    <DialogContent>

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Disagree
                    </Button>
                        <Button onClick={e => submitUserData(e)} color="primary" autoFocus>
                            Agree
                    </Button>
                    </DialogActions>
                </>
            }
        </Dialog>
    )
}