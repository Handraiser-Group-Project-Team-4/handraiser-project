import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import { withSnackbar } from 'notistack';

// COMPONENTS
import CopyToClipBoard from '../../tools/CopyToClipBoard'
import jwtToken from "../../tools/assets/jwtToken";
import { DarkModeContext } from "../../../App";
import cohort from "../../../images/cohort.png";
import UsersModal from '../../tools/UsersModal'

// MATERIAL-UI
import {
    // IconButton,
    Paper,
    Grid,
    // MenuItem,
    Chip,
    CardMedia,
    // Menu,
} from "@material-ui/core";

// ICONS 
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FaceIcon from "@material-ui/icons/Face";

function CohortDetails({ classes, class_id, Lest, enqueueSnackbar}) {
    const userObj = jwtToken();
    const history = useHistory();
    const [classDetails, setClassDetails] = useState([]);
    const { darkMode } = useContext(DarkModeContext);
    const [leaveCohort, setLeaveCohort] = useState({
        open: false,
        data: "",
        err: false
    })
    // const [anchorEl, setAnchorEl] = React.useState(null);

    // const handleClick = event => {
    //     setAnchorEl(event.currentTarget);
    // };

    // const handleClose = () => {
    //     setAnchorEl(null);
    // };

    useEffect(() => {
        axios({
            method: `get`,
            url: `/api/class-details/${class_id}`,
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
            }
        })
            .then(res => setClassDetails(res.data))
            .catch(err => console.log(err))
    }, [])

    const handleLeaveCohort = () => {
        if(leaveCohort.data === 'Confirm')
            axios({
                url: `/api/kickstud/${userObj.user_id}/${class_id}`,
                method: `delete`,
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
                }
            })
                .then(res => {
                    enqueueSnackbar(`You Just Leave on ${classDetails[0].class_title}`, {variant: 'error'})
                    history.push(`/`);
                })
                .catch(err => console.log(err))
        else{
            setLeaveCohort({...leaveCohort, err: true})
        }
    }

    return (
        <>
            {leaveCohort.open&&
                <UsersModal 
                    open={leaveCohort.open}
                    data={leaveCohort}
                    setData={e => setLeaveCohort({ ...leaveCohort, data: e.target.value })}
                    title={`Are you sure you want to leave this cohort?`}
                    modalTextContent = "Leaving on this cohort means that you are not allowed to access this cohort anymore. Please type 'Confirm' to leave"
                    handleClose={() => setLeaveCohort({ data: "", open: false, err: false })}
                    handleSubmit={() => handleLeaveCohort()}
                    type="Leave Cohort"
                    buttonText="LEAVE COHORT"
                />
            }
            <Paper className={classes.paperr} elevation={2}>
                <Grid
                    container
                    spacing={0}
                    className={classes.gridContainerr + " " + classes.banner}
                    style={{
                        backgroundColor: darkMode ? "#333" : null
                    }}
                >
                    <Grid
                        container
                        item
                        xs={12}
                        sm={12}
                        md={8}
                        lg={8}
                        className={classes.loginBoxGridOne}
                    >
                        <Grid item xs={12} sm={12} md={12} lg={6}>
                            <CardMedia
                                className={classes.loginBoxGridOneCardMedia}
                                image={cohort}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={6}
                            className={classes.gridDetails}
                        >
                            <h1>{classDetails.length > 0&&classDetails[0].class_title}</h1>

                            {(userObj.user_role_id === 2) &&
                                <h6 style={{display:`flex`, justifyContent:`center`}}>
                                    Cohort Code: <Chip label="**********" />    
                                    <CopyToClipBoard data={classDetails.length>0&&classDetails[0].class_key} />
                                </h6>
                            }
                            <p style={{ color: `red`, fontSize: `10px`, cursor: `pointer` }} onClick={() => setLeaveCohort({...leaveCohort, open: true})}>Leave Cohort</p>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        spacing={0}
                        className={classes.gridContainerr + " " + classes.banner}
                        style={{
                            backgroundColor: darkMode ? "#333" : null
                        }}
                    >
                        <Grid
                            container
                            item
                            xs={12}
                            sm={12}
                            md={8}
                            lg={8}
                            className={classes.lest}
                        >
                            {/* <h1 style={{ margin: 0 }}>Mentor</h1> */}
                            <Lest>
                                <ul className={classes.lestUl}>
                                    <li
                                        className="list"
                                        style={{
                                            padding: 10,
                                            textTransform: "uppercase"
                                        }}
                                    >
                                        <div
                                            className="list__profile"
                                            style={{ width: "71%" }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    width: "17%",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}
                                            >
                                                Avatar
                                    </div>
                                            <div>
                                                <img style={{ width: 50 }} src=""></img>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    width: "40%"
                                                }}
                                            >
                                                Role
                                    </div>
                                            <div>
                                                <img style={{ width: 50 }} />
                                            </div>
                                            <div className="list__label">
                                                <div className="list__label--value">Name</div>
                                            </div>
                                        </div>
                                        <div className="list__photos">
                                            <span
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    width: "53%"
                                                }}
                                            >
                                                Date Joined
                                    </span>
                                            <span></span>
                                            <span></span>
                                            {/* <span
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                width: "45%"
                                            }}
                                        >
                                            Actions
                                    </span> */}
                                        </div>
                                    </li>
                                    {classDetails.map(user => (
                                        <li className="list" key={user}>
                                            <div className="list__profile">
                                                <div>
                                                    <img src={user.avatar} />
                                                </div>
                                                <div>
                                                    <img
                                                        style={{
                                                            width: 50
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <Chip
                                                        icon={<FaceIcon />}
                                                        label={(user.user_role_id === 2) ? `Mentor` : `student`}
                                                        color={(user.user_role_id === 2) ? `secondary` : `primary`}
                                                    />
                                                </div>
                                                <div>
                                                    <img
                                                        style={{
                                                            width: 50
                                                        }}
                                                    />
                                                </div>
                                                <div className="list__label">
                                                    <div className="list__label--value">
                                                        <Chip
                                                            variant="outlined"
                                                            label={user.firstname + ' ' + user.lastname}
                                                            className={classes.listChip}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="list__photos">
                                                <span
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    {user.date_joined}
                                                </span>
                                                <span></span>
                                                <span></span>
                                                {/* <span
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    width: "45%"
                                                }}
                                            >
                                                <IconButton
                                                    color="primary"
                                                    aria-controls="simple-menu"
                                                    aria-haspopup="true"
                                                    onClick={handleClick}
                                                    component="span"
                                                >
                                                    <ExpandMoreIcon />
                                                </IconButton>
                                                <Menu
                                                    id="simple-menu"
                                                    anchorEl={anchorEl}
                                                    keepMounted
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleClose}
                                                >
                                                    <MenuItem onClick={handleClose}>
                                                        Profile
                                        </MenuItem>
                                                    <MenuItem onClick={handleClose}>
                                                        My account
                                        </MenuItem>
                                                    <MenuItem onClick={handleClose}>
                                                        Logout
                                        </MenuItem>
                                                </Menu>
                                            </span> */}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </Lest>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </>
    )
}

export default withSnackbar(CohortDetails);