import React, { useState, useEffect, useContext } from 'react';

import axios from 'axios';
import { Redirect, useHistory } from 'react-router-dom';
import io from 'socket.io-client';

// COMPONENTS
import { newUserContext } from '../../routes';
import jwtToken from '../tools/assets/jwtToken';
import MainpageTemplate from '../tools/MainpageTemplate';
import CohortList from '../cohort/CohortList';
import UsersModal from '../tools/UsersModal';

// MATERIAL-UI
import { makeStyles, AppBar, Tabs, Tab } from '@material-ui/core';

let socket;
export default function StudentPage({ value }) {
	const [request, setRequest] = useState();
	const [open, setOpen] = useState(true);
	const { isNew } = useContext(newUserContext);
	const ENDPOINT = 'localhost:3001';
	const userObj = jwtToken();
	const classes = useStyles();
	const history = useHistory();

	sessionStorage.setItem('newUser', isNew);

	useEffect(() => {
		socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
	}, [ENDPOINT]);

	useEffect(() => {
		socket.on('studentToMentor', user_id => {
			if (userObj.user_id === user_id)
				alert(
					`Your role has been change to Mentor. Please Logout to see the changes!`
				);
		});
	});

	useEffect(() => {
		socket.on('notifyUser', ({ user_id, approval_status }) => {
			if (userObj.user_id === user_id) {
				if (approval_status.user_approval_status_id === 1)
					alert(
						`Your Request has been Approve. Please Logout to see the changes!`
					);

				if (approval_status.user_approval_status_id === 3)
					alert(
						`Your Request has been Disapprove. Reason: ${approval_status.reason_disapproved}`
					);
			}
		});

		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	});

	const handleMentor = () => {
		axios({
			method: `patch`,
			url: `/api/pending/${userObj.user_id}`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				setRequest('pending');
				sessionStorage.setItem('newUser', 'pending');

				socket.emit('mentorRequest', { data: userObj });

				setTimeout(() => {
					alert(`Request Successfully Sent.`);
				}, 500);

				console.log(res);
			})
			.catch(err => console.log(err));
	};

	if (userObj) {
		if (userObj.user_role_id === 1) return <Redirect to="/admin-page" />;
		else if (userObj.user_role_id === 2) return <Redirect to="/mentor-page" />;
	} else return <Redirect to="/" />;

	return (
		<MainpageTemplate>
			{sessionStorage.getItem('newUser') === 'pending' ||
			request === 'pending' ||
			userObj.user_approval_status_id === 2 ? (
				<h3>Request Sent. Waiting for Confirmation!</h3>
			) : (
				sessionStorage.getItem('newUser') === 'true' && (
					<UsersModal
						open={open}
						handleClose={() => setOpen(false)}
						handleSubmit={handleMentor}
						type="New User"
						buttonText="I'am a Mentor"
					/>
				)
			)}

			<div className={classes.parentDiv}>
				<div className={classes.tabRoot}>
					<AppBar position="static" color="default">
						<Tabs
							value={value}
							// onChange={handleChange}
							indicatorColor="primary"
							textColor="primary"
							centered
						>
							<Tab
								label="All Cohorts"
								onClick={() => history.push('/student-page')}
							/>
							<Tab
								label="My Cohorts"
								onClick={() => history.push('/student-page/my-cohort')}
							/>
						</Tabs>
					</AppBar>
					<CohortList classes={classes} value={value} />
				</div>
			</div>
		</MainpageTemplate>
	);
}

const useStyles = makeStyles(theme => ({
	parentDiv: {
		[theme.breakpoints.up('md')]: {
			minHeight: '100vh'
		},
		minHeight: 'calc(100vh - 64px)',
		backgroundColor: '#F5F5F5',
		display: 'flex',
		width: '100%!important'
	},
	textField: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		width: 200
	},
	paperr: {
		display: 'flex'
	},
	'@global': {
		body: {
			fontFamily: "'Rubik', sans-serif"
		}
	},
	rootq: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		padding: '20px 10px'
	},
	cardRoot: {
		minWidth: 590,
		maxWidth: 590,
		borderRadius: 10,
		'& > div:first-of-type': {
			paddingBottom: 10
		}
	},
	cohortCardActions: {
		padding: 0,
		'& > button': {
			width: '100%',
			backgroundColor: '#673ab7',
			font: '500 16px/1 "Poppins", sans-serif',
			padding: 20,
			color: 'white'
		},
		'& > button:hover': {
			opacity: '0.8',
			backgroundColor: '#6e3dc2'
		}
	},
	cardDesc: {
		display: 'flex',
		flexDirection: 'column',
		'& > div': {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between'
		},
		'& > div:first-of-type': {
			height: '48%'
		},
		'& > div:last-of-type': {
			height: '45%'
		},
		'& > div > h3': {
			font: "700 24px/1.2 'Poppins', sans-serif",
			marginBottom: 0
		},
		'& > div:last-of-type > span': {
			display: 'flex',
			paddingTop: 5
		},
		'& > div:last-of-type > span > p': {
			color: '#999',
			textTransform: 'uppercase',
			fontSize: 18,
			width: '40%',
			margin: 0
		},
		'& > div:last-of-type > span > h5': {
			font: "500 18px/1.2 'Poppins', sans-serif",
			width: '60%',
			margin: 0,
			paddingTop: 3
		}
	},
	profile__image: {
		padding: '30px 20px 20px',
		'& > img': {
			width: 120,
			height: 120,
			borderRadius: '50%',
			border: '3px solid #fff',
			boxShadow: '0 0 0 4px #673ab7'
		}
	},
	tabRoot: {
		width: '100%',
		flexGrow: 1
	}
}));
