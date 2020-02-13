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
	MenuItem
} from '@material-ui/core';

// ICONS
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HelpIcon from '@material-ui/icons/Help';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import DeleteIcon from '@material-ui/icons/Delete';


let socket;
export default function Students({
	room_id,
	id,
	status,
	student_id,
	index,
	text,
	classes
}) {
	const userObj = jwtToken();
	const ENDPOINT = 'localhost:3001';
	const [student, setStudent] = useState([]);
	const { chatHandler } = useContext(UserContext);
	const handleClose = () => setAnchorEl(null);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const handleClick = e => setAnchorEl(e.currentTarget);
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
				setStudent(res.data);
			})
			.catch(err => console.log(err));
	}, [student_id]);

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

	// return (
	//   <>
	//     <ListItem
	//       alignItems="flex-start"
	//       onClick={e => chatHandler(e, { room: id, concern: text })}
	//     >
	//       <ListItemAvatar>
	//         <Avatar alt={student.firstname} src={student.avatar} />
	//       </ListItemAvatar>
	//       <ListItemText
	//         primary={`${student.firstname} ${student.lastname}`}
	//         secondary={
	//           <React.Fragment>
	//             {`Problem: ${text}`}
	//             <Typography
	//               component="span"
	//               variant="body2"
	//               className={classes.inline}
	//             ></Typography>
	//           </React.Fragment>
	//         }
	//       />
	//       {status === "pending" && userObj.user_role_id === 2 ? (
	//         <HelpIcon
	//           onClick={e => {
	//             handleUpdate(e, "onprocess");
	//           }}
	//         />
	//       ) : status === "onprocess" && userObj.user_role_id === 2 ? (
	//         <>
	//           <CheckCircleIcon style={{ marginLeft: 10 }} />

	//           <RemoveCircleIcon
	//             style={{ marginLeft: 10 }}
	//             onClick={e => {
	//               handleUpdate(e, "pending");
	//             }}
	//           />
	//         </>
	//       ) : status === "pending" &&
	//         userObj.user_role_id === 3 &&
	//         userObj.user_id === student_id ? (
	//         <DeleteIcon
	//           onClick={e => {
	//             handleDelete(e);
	//           }}
	//         />
	//       ) : null}
	//     </ListItem>
	//     <Divider variant="inset" component="li" />
	//   </>
	// );
	return (
		<ListItem
			key={index}
			className={classes.beingHelped}
			button={userObj.user_id === student_id || userObj.user_role_id === 2}
			onClick={e =>
				userObj.user_id === student_id ||
				(userObj.user_role_id === 2 &&
					status !== 'pending' &&
					chatHandler(e, { room: id, concern: text }))
			}
		>
			<CardHeader
				key={index}
				className={classes.cardHeaderRoot}
				style={{
					border: userObj.user_id === student_id ? '2px solid #673ab7' : 'none'
				}}
				// classes={{
				// 	span: 'una'
				// }}
				avatar={
					<Avatar
						alt={student.firstname}
						className={classes.avatar}
						src={student.avatar}
					/>
				}
				action={
					<div>
						{userObj.user_role_id === 3 && status === 'onprocess' ? null : (
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
							) : status === 'onprocess' && userObj.user_role_id === 2 ? (
								<>
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
									<MenuItem onClick={e => handleUpdate(e, 'pending')}>
										<ListItemIcon>
											<RemoveCircleIcon />
										</ListItemIcon>
										<Typography variant="inherit">
											Send back to Need Help Queue
										</Typography>
									</MenuItem>
								</>
							) : status === 'pending' &&
							  userObj.user_role_id === 3 &&
							  userObj.user_id === student_id ? (
								<MenuItem onClick={e => handleDelete(e)}>
									<ListItemIcon>
										<DeleteIcon />
									</ListItemIcon>
									<Typography variant="inherit">Remove Handraise</Typography>
								</MenuItem>
							) : null}
						</Menu>
					</div>
				}
				title={`Problem: ${text}`}
				subheader={student.firstname + ' ' + student.lastname}
			/>
		</ListItem>
	);
}
