import React, { createContext, useState, useEffect } from 'react';
import MainpageTemplate from '../tools/MainpageTemplate';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import Help from './HelpForm';
import NeedHelp from './NeedHelp';
import BeingHelp from './BeingHelp';
import Chat from '../Chat/Chat';
import Axios from 'axios';
import jwtToken from '../tools/jwtToken';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

export const UserContext = createContext(null);

let socket;
const username = `noe`;
const room = '40';

export default function CohortPage(props) {
	const classes = useStyles();
	const userObj = jwtToken();
	const ENDPOINT = 'localhost:3001';
	const { id } = props.match.params;
	const [data, setData] = useState([]);
	const [user, setUser] = useState([]);
	const [chatRoom, setChatRoom] = useState({});

	useEffect(() => {
		socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
		socket.emit('join', { class_id: id, user_id: userObj.user_id }, () => {});
	}, [ENDPOINT]);

	useEffect(() => {
		Axios({
			method: 'get',
			url: `/api/concern/${id}`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				socket.emit('concern', res.data, () => {});
			})
			.catch(err => console.log(err));
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
	}, [id, userObj.user_id]);

	useEffect(() => {
		socket.on('output', values => {
			setData(values);
		});
		socket.on('chatRoom', values => {
			if (
				values.student_id === userObj.user_id ||
				values.mentor_id === userObj.user_id
			) {
				setChatRoom(values);
				socket.emit('joinChat', values, () => {});
			}
		});
		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	}, []);

	return (
		<MainpageTemplate>
			<Link to="/">Go Back</Link>
			<UserContext.Provider
				value={{ id, data, setData, user, setUser, socket, chatRoom }}
			>
				<div className={classes.root}>
					<Grid container spacing={3}>
						<Grid item xs={6} lg={3}>
							<Help />
							<NeedHelp />
							<BeingHelp />
						</Grid>
						<Grid item xs={6} lg={9}>
							{chatRoom.chat ? <Chat /> : null}
						</Grid>
					</Grid>
				</div>
			</UserContext.Provider>
		</MainpageTemplate>
	);
}

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		padding: 50
	}
}));
