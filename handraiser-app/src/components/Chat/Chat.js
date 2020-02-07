import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import jwtToken from '../tools/jwtToken';
import { UserContext } from './../cohort/CohortPage';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
// import styled from 'styled-components';
import { purple } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import SendIcon from '@material-ui/icons/Send';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Container from '@material-ui/core/Container';

const Chat = () => {
	const classes = useStyles();
	const [expanded, setExpanded] = React.useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};
	const userObj = jwtToken();
	const [oldChat, setOldChat] = useState([]);
	const [currentChat, setCurrentChat] = useState([]);
	const [message, setMessage] = useState('');
	const { chatRoom, socket } = useContext(UserContext);
	const { concern_id } = chatRoom;

	useEffect(() => {
		axios({
			method: 'get',
			url: `/api/users/${userObj.user_id}?chat=true&concern_id=${concern_id}`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				setOldChat(res.data.messages);
			})
			.catch(err => {
				console.log(err);
			});
	}, [concern_id]);

	useEffect(() => {
		socket.on('message', message => {
			// console.log(message);
			if (message.concern_id === concern_id) {
				setCurrentChat([...currentChat, message]);
			}
		});
		socket.emit('saveChat', currentChat);
	}, [currentChat]);

	const sendMessage = event => {
		event.preventDefault();
		if (message) {
			socket.emit('sendMessage', { message, concern_id }, () => setMessage(''));
		}
	};

	return (
		<Container maxWidth="md">
			<Card className={classes.root}>
				<CardHeader
					avatar={
						<Avatar aria-label="recipe" className={classes.avatar}>
							{concern_id}
						</Avatar>
					}
					action={
						<IconButton aria-label="settings">
							<MoreVertIcon />
						</IconButton>
					}
					title="React Hook useEffect has a missing dependency"
					subheader="September 14, 2016"
				/>
				<Divider />
				<CardContent className={classes.media}>
					<Box style={{ maxHeight: 500, overflow: 'auto' }}>
						{oldChat.map((message, i) => (
							<div key={i}>
								{message.user_id != userObj.user_id ? (
									<Box
										display="flex"
										justifyContent="flex-start"
										alignContent="flex-start"
										style={{ paddingBottom: '15px' }}
									>
										<Avatar className={classes.chatAvatar}>H</Avatar>
										<Container className={classes.chat}>
											{message.text}
										</Container>
									</Box>
								) : (
									<Box
										display="flex"
										justifyContent="flex-end"
										alignContent="flex-start"
										style={{ paddingBottom: '15px' }}
									>
										<Container className={classes.chat}>
											{message.text}
										</Container>
										<Avatar className={classes.chatLeftAvatar} />
									</Box>
								)}
							</div>
						))}
						{currentChat.map((message, i) => (
							<div key={i}>
								{message.user_id != userObj.user_id ? (
									<Box
										display="flex"
										justifyContent="flex-start"
										alignContent="flex-start"
										style={{ paddingBottom: '15px' }}
									>
										<Avatar className={classes.chatAvatar}>H</Avatar>
										<Container className={classes.chat}>
											{message.text}
										</Container>
									</Box>
								) : (
									<Box
										display="flex"
										justifyContent="flex-end"
										alignContent="flex-start"
										style={{ paddingBottom: '15px' }}
									>
										<Container className={classes.chat}>
											{message.text}
										</Container>
										<Avatar className={classes.chatLeftAvatar} />
									</Box>
								)}
							</div>
						))}
					</Box>
				</CardContent>
				<CardActions disableSpacing>
					<TextField
						id="filled-full-width"
						style={{ margin: 8 }}
						placeholder="Send a message here"
						fullWidth
						margin="normal"
						variant="outlined"
						value={message}
						onChange={({ target: { value } }) => setMessage(value)}
						onKeyPress={event =>
							event.key === 'Enter' ? sendMessage(event) : null
						}
					/>
					<IconButton
						className={clsx(classes.expand, {
							[classes.expandOpen]: expanded
						})}
						onClick={handleExpandClick}
						aria-expanded={expanded}
						aria-label="show more"
					>
						<SendIcon />
					</IconButton>
				</CardActions>
			</Card>
		</Container>
	);
};

export default Chat;

const useStyles = makeStyles(theme => ({
	root: {
		maxWidth: 900
	},
	media: {
		height: '500px'
	},
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest
		})
	},
	expandOpen: {
		transform: 'rotate(360deg)'
	},
	avatar: {
		backgroundColor: purple[300]
	},
	chatAvatar: {
		marginRight: '10px'
	},
	chatLeftAvatar: {
		marginLeft: '10px'
	},
	chat: {
		// paddingBottom: "15px",
		padding: '10px',
		margin: '0',
		width: 'auto',
		backgroundColor: 'lightgrey',
		borderRadius: '50px'
	}
}));
