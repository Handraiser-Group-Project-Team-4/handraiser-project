import React from 'react';
import {
	CardHeader,
	Avatar
	// IconButton,
	// Typography,
	// MenuItem,
	// Menu
} from '@material-ui/core';

// import MoreVertIcon from '@material-ui/icons/MoreVert';

const ChatHeader = ({
	classes,
	// handleClick,
	// anchorEl,
	// handleClose,
	// handleModal,
	chatroom
}) => {
	const date = () => {
		var new_date = new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: '2-digit'
		}).format(new Date());
		return new_date;
	};

	return (
		<CardHeader
			avatar={
				<Avatar aria-label="recipe" className={classes.avatar}>
					R
				</Avatar>
			}
			// action={
			// 	<>
			// 		<IconButton aria-label="settings" onClick={handleClick}>
			// 			<MoreVertIcon />
			// 		</IconButton>
			// 		<Menu
			// 			elevation={1}
			// 			id="simple-menu"
			// 			anchorEl={anchorEl}
			// 			keepMounted
			// 			open={Boolean(anchorEl)}
			// 			onClose={handleClose}
			// 		>
			// 			<MenuItem onClick={handleModal}>
			//         <Typography variant="inherit">Add Mentor</Typography>
			//       </MenuItem>
			// 		</Menu>
			// 	</>
			// }
			title={chatroom.concern}
			subheader={date()}
		/>
	);
};

export default ChatHeader;
