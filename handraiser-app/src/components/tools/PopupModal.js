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
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SchoolIcon from '@material-ui/icons/School';
import InputAdornment from '@material-ui/core/InputAdornment';
import Attending from "../adminPage/CohortTools/Attending"

let socket;
export default function PopupModal({ title, data, open, handleClose, render, type, id, canDelete, cohorts, getCohorts}) {
    const ENDPOINT = "localhost:3001";
    const [attending, setAttending] = useState({
        open: false,
        data: ''
    })
    const [counter, setCounter] = useState({
        title: '30',
        descriptiob: '50'
    })
    const [body, setBody] = useState({
        data: 
        (type === 'updating')?
            {
                class_title: data.class_title,
                class_description: data.class_description 
            }:
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

    const closeAttending = () => {
        setAttending({
          ...attending,
          open: false
        })
        getCohorts()
      }

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

    const manageEnrolled = data => {
        
        setAttending({ 
            open: true, 
            data: data 
        })
    }

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

        {e.target.name === 'class_title' && (
        setCounter({
            ...counter,
            title: 30-newBawas
        })
        )}
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

    const updateCohort = e => {
        setBody({
            data:{
                ...body.data,
                [e.target.name]: e.target.value
            }
        })
        console.log(body)
    } 

    const submitUserData = e => {
        e.preventDefault();
        const METHOD = 
                        (type === "updating")? 'patch' :   
                        (type === "Create Cohort")? 'post' :
                        (type === "disapproving") ? 'patch' : 
                        (type === "approving") ? 'patch' : 
                        (type === "Create Cohort") ? 'patch':
                        (type === "Change Key") ? 'patch' :
                        (type === "users") ? 'patch' :
                        (type === 'Toggle Cohort') ? 'patch' : 
                        (type === 'Delete Cohort') ? 'delete' :
                        (type === 'Kick Student')? 'delete': null
                            
        const URL = (type === 'updating')? `/api/updateTitleDesc/${data.class_id}`:
                    (type === 'approving')?`/api/toapprove/${data.user_id}`:
                    (type === 'disapproving')?`/api/todisapprove/${data.user_id}`:
                    (type === 'Create Cohort')?`/api/class`:
                    (type === 'Change Key')?`/api/class/${data.classroom_id}`: 
                    (type === 'users')?`/api/assigning/${data.user_id}`:
                    (type === 'Toggle Cohort')?`/api/toggleCohort/${data.row.class_id}?toggle_class_status=${data.toggle_class_status}` :
                    (type === 'Delete Cohort') ? `/api/deleteClass/${id}`:
                    (type === 'Kick Student')? `/api/kickstud/${data.user_id}/${data.class_id}`: null
       
       if (type === 'users')
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
                    socket.emit("changeUserRole", {user_id: data.user_id, user_role_id: data.role});

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
                if(type === 'Change User Role')
                        socket.emit("changeUserRole", { user_id: data.id, user_role_id: data.role });

                if (type === 'Create Cohort' || type === 'Toggle Cohort')
                    socket.emit("renderCohort", { data: body.data });
                
                if (type === 'approving' || type === 'disapproving') 
                    socket.emit("handleRoleRequest", { user_id: data.user_id, approval_status: body.data });
                

                if (type === 'Kick Student')
                    handleClose(data.class_id);
                
                else{ 
                    render()
                    handleClose()
                }
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
            onClose={(type === 'Kick Student') ? (e) => handleClose(data.class_id) : handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth='sm'
        >
            {(type !== 'approving' || type === 'Kick Student')?
                <form onSubmit={submitUserData}>
                    <DialogTitle id="alert-dialog-title" >
                        {title}
                        {(type === 'users') ? 
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
                        {(type === 'updating')?
                        <div style={{display: `flex`, flexDirection: `column`}}>
                            
                            <TextField
                                id="outlined-textarea2"
                                label="Class Title"
                                name="class_title"
                                onChange={updateCohort}
                                defaultValue={body.data.class_title}
                                variant="outlined"
                            />
                            <br/>
                            <TextField
                                id="outlined-textarea1"
                                label="Class Description"
                                multiline
                                name="class_description"
                                rows="3"
                                defaultValue={body.data.class_description}
                                onChange={updateCohort}
                                variant="outlined"
                            />
                              </div>
                         :
                            
                        (type === 'disapproving')?
                        <div style={{display: `flex`, flexDirection: `column`}}>
                            <TextField
                                id="outlined-textarea"
                                label="Reason"
                                multiline
                                name="reason_disapproved"
                                rows="3"
                                onChange={handleReason}
                                variant="outlined"
                            />
                              </div>
                         :(type === 'Create Cohort')?
                            <div style={{display: `flex`, flexDirection: `column`}}>
                               
                                <TextField
                                    id="outlined-textarea2"
                                    name="class_title"
                                    label="Title"
                                    variant="outlined"
                                    onChange={handleInputs}
                                    InputProps={{
                                        endAdornment: <InputAdornment 
                                                        style={{
                                                            color:(counter.title < 5) ? "red" : null,
                                                            opacity: '0.5'
                                                        }} 
                                                        position="end">{counter.title}/30</InputAdornment>
                                    }}
                                    inputProps={{
                                        maxLength: 30,
                                    }}
                                />
                
                                <br/>
                                <TextField
                                    id="outlined-textarea"
                                    name="class_description"
                                    label="Class Description"
                                    onChange={handleInputs}
                                    variant="outlined"
                                    multiline
                                    rows="3"
                                />
                            </div>
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

                    <DialogActions >
                        {(type !== 'Delete Cohort')
                        
                        ?
                            <>
              
                            {(type === 'users') ? 
                                <Button onClick={(e)=>manageEnrolled(data)} color="secondary" style={{float: 'right'}} autoFocus>
                                    Manage Enrolled Cohorts
                                </Button>
                            : null}

                   
                                    <Button onClick={(type === "Kick Student") ? (e)=>handleClose(data.class_id) : handleClose} color="secondary">
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
                                {(canDelete === "yes")
                                ?
                                <Button type="submit" color="secondary" autoFocus>
                                    Confirm
                                </Button>
                                :
                                <Button onClick={handleClose}  color="secondary" autoFocus>
                                    Confirm
                                </Button>
                                }
                            </>
                        }
                       
                    </DialogActions>
                </form>
                :
                <>  
                    
                    <DialogTitle id="alert-dialog-title"> Are you sure you want to approve {data.firstname} {data.lastname} as a mentor?</DialogTitle>

                    <DialogContent>

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Close
                    </Button>
            
                
                        <Button onClick={e => submitUserData(e)} color="secondary" autoFocus>
                            Approve
                    </Button>
                          
                       
                    </DialogActions>
                </>
            }

        </Dialog>
        </>
    )
}