import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import io from 'socket.io-client';

// COMPONENTS
import jwtToken from '../../tools/assets/jwtToken';
import { UserContext } from './CohortPage';

// MATERIAL-UI
import {
	ListItemIcon,
	IconButton,
	ListItem,
	Typography,
	CardHeader,
	Avatar,
	Menu,
	MenuItem,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
	TextField
} from '@material-ui/core';

// ICONS
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HelpIcon from '@material-ui/icons/Help';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

let socket;
export default function Students({
	room_id,
	id,
	status,
	student_id,
	index,
	text,
	classes,
	darkMode
}) {
	const userObj = jwtToken();
	const ENDPOINT = 'localhost:3001';
	const { chatHandler } = useContext(UserContext);
	const handleClose = () => setAnchorEl(null);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const handleClick = e => setAnchorEl(e.currentTarget);

	const [student, setStudent] = useState([]);
	const [open, setOpen] = useState(false);
	const [isEmpty, setIsEmpty] = useState(false);
	const [value, setValue] = useState('');

	useEffect(() => {
		socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
	}, [ENDPOINT]);

	useEffect(() => {
		Axios({
			method: 'get',
			url: `/api/users/${student_id}`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				setValue(text);
				setStudent(res.data);
			})
			.catch(err => console.log(err));
	}, [student_id, text]);

	const handleUpdate = (e, value) => {
		e.preventDefault();
		const obj = {
			concern_status: value,
			mentor_id: userObj.user_id
		};
		socket.emit(
			'updateConcern',
			{ id: room_id, concern_id: id, updateData: obj, userObj: userObj },
			() => {}
		);
	};
	const handleDelete = event => {
		event.stopPropagation();
		socket.emit(
			'deleteConcern',
			{ id: room_id, concern_id: id, userObj: userObj },
			() => {}
		);
	};

	const handleUpdateConcern = e => {
		e.preventDefault();
		if (value) {
			socket.emit(
				'updateConcernText',
				{ id: room_id, concern_id: id, text: value, userObj: userObj },
				() => {}
			);
			setIsEmpty(false);
			setOpen(false);
		} else {
			setIsEmpty(true);
		}
	};

	const handleCloseModal = () => {
		setOpen(false);
		setIsEmpty(false);
		setValue(text);
	};

	return (
		<>
			<ListItem
				key={index}
				className={classes.beingHelped}
				button={userObj.user_id === student_id || userObj.user_role_id === 2}
				onClick={e =>
					userObj.user_id === student_id ||
					(userObj.user_role_id === 2 &&
						status !== 'pending' &&
						chatHandler(e, { room: id, concern: text, concern_status: status }))
				}
				style={{
					backgroundColor: darkMode ? '#424242' : null
				}}
			>
				<CardHeader
					key={index}
					className={classes.cardHeaderRoot}
					style={{
						border:
							userObj.user_id === student_id ? '2px solid #673ab7' : 'none'
					}}
					avatar={
						<Avatar
							alt={student.firstname}
							className={classes.avatar}
							src={student.avatar}
						/>
					}
					action={
						<div>
							{(userObj.user_role_id === 3 && status === 'onprocess') ||
							status === 'done' ||
							(userObj.user_id !== student_id &&
								userObj.user_role_id !== 2) ? null : (
								<IconButton aria-label="settings" onClick={handleClick}>
									<MoreVertIcon />
								</IconButton>
							)}

							<Menu
								elevation={1}
								id="simple-menu"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleClose}
							>
								{status === 'pending' && userObj.user_role_id === 2 ? (
									<MenuItem onClick={e => handleUpdate(e, 'onprocess')}>
										<ListItemIcon>
											<HelpIcon />
										</ListItemIcon>
										<Typography variant="inherit">Help Mentee!</Typography>
									</MenuItem>
								) : null}
								{status === 'pending' && userObj.user_role_id === 2 ? (
									<MenuItem onClick={e => handleDelete(e)}>
										<ListItemIcon>
											<DeleteIcon />
										</ListItemIcon>
										<Typography variant="inherit">Remove Handraise</Typography>
									</MenuItem>
								) : null}

								{status === 'onprocess' && userObj.user_role_id === 2 ? (
									<MenuItem
										onClick={e => {
											handleUpdate(e, 'done');
										}}
									>
										<ListItemIcon>
											<CheckCircleIcon />
										</ListItemIcon>
										<Typography variant="inherit">Done</Typography>
									</MenuItem>
								) : null}

								{status === 'onprocess' && userObj.user_role_id === 2 ? (
									<MenuItem onClick={e => handleUpdate(e, 'pending')}>
										<ListItemIcon>
											<RemoveCircleIcon />
										</ListItemIcon>
										<Typography variant="inherit">
											Send back to Need Help Queue
										</Typography>
									</MenuItem>
								) : null}
								{status === 'pending' &&
								userObj.user_role_id === 3 &&
								userObj.user_id === student_id ? (
									<MenuItem onClick={e => handleDelete(e)}>
										<ListItemIcon>
											<DeleteIcon />
										</ListItemIcon>
										<Typography variant="inherit">Remove Handraise</Typography>
									</MenuItem>
								) : null}

								{status === 'pending' &&
								userObj.user_role_id === 3 &&
								userObj.user_id === student_id ? (
									<MenuItem onClick={e => setOpen(true)}>
										<ListItemIcon>
											<EditIcon />
										</ListItemIcon>
										<Typography variant="inherit">Edit Handraise</Typography>
									</MenuItem>
								) : null}
							</Menu>
						</div>
					}
					title={`${text}`}
					subheader={student.firstname + ' ' + student.lastname}
				/>
			</ListItem>

			<Dialog
				// fullScreen={fullScreen}
				fullWidth={true}
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Handraiser Concern</DialogTitle>
				<DialogContent>
					<DialogContentText>Please type your concern below.</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="concern"
						label="My concern"
						type="text"
						fullWidth
						value={value}
						onChange={e => setValue(e.target.value)}
						error={isEmpty}
						helperText={isEmpty ? 'Required input field.' : null}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseModal} color="primary">
						Cancel
					</Button>
					<Button onClick={handleUpdateConcern} color="primary">
						Subscribe
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
