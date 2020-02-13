import React, { useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import jwtToken from '../tools/assets/jwtToken';
import io from 'socket.io-client';

import MainpageTemplate from '../tools/MainpageTemplate';
import CohortList from '../cohort/CohortListOld';
import CreateCohort from '../cohort/CreateCohort';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import Unnamed from '../../images/unnamed.jpg';

let socket;
export default function MentorPage({ value = 0 }) {
	const ENDPOINT = 'localhost:3001';
	const userObj = jwtToken();
	const classes = useStyles();
	const history = useHistory();
	useEffect(() => {
		socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
	}, [ENDPOINT]);

	useEffect(() => {
		socket.on('mentorToStudent', user_id => {
			console.log(user_id, userObj.user_id);
			if (userObj.user_id === user_id)
				alert(
					`Your role has been change to Student Please Logout to see the changes!`
				);
		});

		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	});

	if (userObj) {
		if (userObj.user_role_id === 1) return <Redirect to="/admin-page" />;
		else if (userObj.user_role_id === 3) return <Redirect to="/student-page" />;
	} else return <Redirect to="/" />;

	return (
		<MainpageTemplate>
			{/* <div
        style={{
          display: `flex`,
          flexDirection: `column`,
          justifyContent: `center`,
          alignItems: `center`,
          height: `100vh`
        }}
      >
        <h1>
          THIS IS WHERE THE COHORT LIST IS LOCATED <i>[Mentor Page]</i>
        </h1>
        <CreateCohort />
        <CohortLists mentor={true} />
      </div> */}
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
								onClick={() => history.push('/mentor-page')}
							/>
							<Tab
								label="My Cohorts"
								onClick={() => history.push('/mentor-page/my-cohort')}
							/>
						</Tabs>
					</AppBar>
					<CohortList classes={classes} value={value} mentor={true} />
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
			height: '55%'
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
