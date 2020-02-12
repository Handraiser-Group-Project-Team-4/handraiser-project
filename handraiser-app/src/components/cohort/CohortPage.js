import React, { createContext, useState, useEffect } from 'react';
import MainpageTemplate from '../tools/MainpageTemplate';
import { Link } from 'react-router-dom';
import Help from './HelpForm';
import NeedHelp from './NeedHelp';
import BeingHelp from './BeingHelp';
import Chat from '../Chat/Chat';
import Axios from 'axios';
import jwtToken from '../tools/assets/jwtToken';
import io from 'socket.io-client';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

export const UserContext = createContext(null);

const userDetails = {
	username: 'noe',
	room: '3'
};

let socket;

export default function CohortPage(props) {
	const ENDPOINT = 'localhost:3001';
	const classes = useStyles();
	const userObj = jwtToken();
	const { id } = props.match.params;
	const [data, setData] = useState([]);
	const [user, setUser] = useState();
	const [chatroom, setChatRoom] = useState({
		room: 187,
		concern: 'Request for help'
	});

	useEffect(() => {
		Axios({
			method: 'get',
			url: `/api/concern/${id}`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				setChatRoom({
					room: res.data[0].concern_id,
					concern: res.data[0].concern_title
				});
			})
			.catch(err => console.log(err));
	}, []);

	useEffect(() => {
		Axios({
			method: 'get',
			url: `/api/users/${userObj.user_id}`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				setUser(res.data);
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

	useEffect(() => {
		socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
		socket.emit('joinConcern', { id }, error => {});
	}, [ENDPOINT]);

	useEffect(() => {
		socket.on('concernData', concern => {
			setData([...concern.res]);
		});
		return () => {
			socket.emit('disconnectConcern');
			socket.off();
		};
	}, [data]);

	const sendConcern = (event, concern) => {
		event.stopPropagation();
		if (concern) {
			socket.emit('sendConcern', { concern }, () => {});
		}
	};

	const chatHandler = (event, value) => {
		event.stopPropagation();
		setChatRoom(value);

		socket.emit('disconnect');
		socket.off();
	};

	return (
		<MainpageTemplate>
			<Link to="/">Go Back</Link>
			<div className={classes.root}>
				<UserContext.Provider
					value={{
						id,
						chatroom,
						setChatRoom,
						data,
						setData,
						user,
						setUser,
						chatHandler
					}}
				>
					<Grid container spacing={3}>
						<Grid item xs={6} lg={3}>
							<Help />
							<NeedHelp />
							<BeingHelp />
						</Grid>
						<Grid item xs={6} lg={9}>
							<Chat userDetails={userDetails} room={chatroom} />
						</Grid>
					</Grid>
				</UserContext.Provider>
			</div>
		</MainpageTemplate>
	);
}

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		padding: 50
	}
}));
