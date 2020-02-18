import React, { useState, useEffect } from 'react'
import axios from 'axios'
import io from "socket.io-client";

// COMPONENTS
import jwtToken from "../tools/assets/jwtToken";

// MATERIAL-UI
import {
    Container,
    Grid,
    Card,
    CardActions,
    CardContent,
    Button,
    Chip,
    Avatar,
    Badge,
    Tooltip,
    Typography
} from "@material-ui/core";

let socket;
export default function CohortContainer({ classes, handleCohort, value }) {
    const userObj = jwtToken();
    const ENDPOINT = "localhost:3001";
    const [classroom, setClassroom] = useState([]);

    useEffect(() => {
        socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
    }, [ENDPOINT]);

    useEffect(() => {
        socket.on("fetchCohort", () => {
            renderCohorts();
        });

        return () => {
            socket.emit("disconnect");
            socket.off();
        };
    });

    useEffect(() => {
        let isCancelled = false;

        if (!isCancelled)
            renderCohorts();
        return () => {
            isCancelled = true
        };
    }, [value]);

    const renderCohorts = (updateFromAdmin) => {
        let temp = [];
        axios({
            method: `get`,
            url: `/api/cohorts?user_id=${userObj.user_id}&&value=${value}`,
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("accessToken")
            }
        })
            .then(res => {
                res.data.map(x => {
                    axios({
                        method: 'get',
                        url: `/api/viewJoinedStudents/${x.class_id}`,
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("accessToken")
                        }
                    })
                        .then(users => {
                            let currentUser, mentor = [], studentCount=0;

                            users.data.map(user => {
                                if (user.user_id === userObj.user_id)
                                    currentUser = user

                                if (user.user_role_id === 2)
                                    mentor.push(user)
                                
                                if(user.user_role_id === 3)
                                    studentCount+=1;
                            })
                            temp.push({studentCount, currentUser, mentor, class_details: x })
                            // setClassroom(prevState => { return [...prevState, {studentCount, currentUser, mentor, class_details: x }] })
                        })
                        .catch(err => console.log(err))
                })
                setTimeout(() => {
                    setClassroom(temp)
                }, 100)
            });
    }

    return (
        <Container className={classes.paperr} maxWidth="xl">
            <Grid container spacing={0} className={classes.gridContainerrr}>
                {classroom.map((x, i) => (
                    <Grid
                        key={i}
                        item
                        xl={6}
                        lg={6}
                        md={12}
                        sm={12}
                        xs={12}
                        className={classes.rootq}
                    >
                        <Card className={classes.cardRoot} elevation={3}>
                            <CardContent>
                                <Grid
                                    container
                                    spacing={0}
                                    className={classes.gridCardContainer}
                                >
                                    <Grid item xs={4} className={classes.profile__image}>
                                        {/* <img src={Unnamed} alt="Pic" /> */}
                                        <Badge
                                            overlap="circle"
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            badgeContent={
                                                (x.mentor.length > 1) &&
                                                <Tooltip title={x.mentor.map((mentor, i) => (i > 0)&&`${mentor.firstname}, `)}>
                                                    <h2 className={classes.num_of_mentor}>+{x.mentor.length - 1}</h2>
                                                </Tooltip>
                                            }
                                        >
                                            <Avatar alt="Mentor's Name" src={(x.mentor[0]) && x.mentor[0].avatar} className={classes.avatar} />
                                        </Badge>
                                    </Grid>
                                    <Grid item xs={8} className={classes.cardDesc}>
                                        <div>
                                            <h3>{x.class_details.class_title}</h3>
                                            <p>{x.class_details.class_description}</p>
                                        </div>
                                        <div>
                                            <span>
                                                <p>Mentor/s</p>
                                                <h5>
                                                    {x.mentor[0]&&x.mentor[0].firstname + ' ' + x.mentor[0].lastname} 
                                                    {x.mentor.length>1&&<b className={classes.num_text_mentor}>+{i>0&& x.mentor.length-1}</b>}
                                                </h5>
                                            </span>
                                                <span>
                                                    <p>Student/s</p>
                                                    <h5>{x.studentCount}</h5>
                                                </span>
                                                <span>
                                                    <p>Cohort Status</p>
                                                    <h5>
                                                        {x.class_details.class_status === "true" ? (
                                                            <Chip
                                                                label="Open"
                                                                style={{
                                                                    backgroundColor: "green",
                                                                    color: `white`,
                                                                    marginTop: -5
                                                                }}
                                                            />
                                                        ) : (
                                                                <Chip
                                                                    label="Close"
                                                                    style={{
                                                                        backgroundColor: "red",
                                                                        color: `white`,
                                                                        marginTop: -5
                                                                    }}
                                                                />
                                                            )}
                                                    </h5>
                                                </span>
                                        </div>
                                    </Grid>
                                    </Grid>
                            </CardContent>
                                <CardActions className={classes.cohortCardActions}>
                                    <Button
                                        size="small"
                                        onClick={() =>
                                            x.class_details.class_status === "true"
                                                ? handleCohort(x.class_details)
                                                : alert("Sorry This class is closed")
                                        }
                                    >
                                        {(x.currentUser) ? `Enter Cohort` : `Join Cohort`}
                                        {/* Join Cohort */}
                                    </Button>
                                </CardActions>
                        </Card>
                    </Grid>
                        ))}
            </Grid>
        </Container>
            )
        }
