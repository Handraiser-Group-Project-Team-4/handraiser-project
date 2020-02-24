import React, { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';

// MATERIAL-UI
import { Card, Divider } from '@material-ui/core';

// COMPONENTS
import { UserContext } from '../cohort/cohortQueue/CohortPage';
import jwtToken from '../tools/assets/jwtToken';
import { DarkModeContext } from '../../App';
import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatAction from './ChatAction';
// import ChatModal from "./ChatModal";

//STYLES
import useStyles from './Style';

let socket;
const Chat = ({ chatResponsive }) => {
	const classes = useStyles(chatResponsive);
	const userObj = jwtToken();
	const { chatroom } = useContext(UserContext);
	const { darkMode } = useContext(DarkModeContext);
	const [showEmoji, setShowEmoji] = useState(false);
	const [modal, setModal] = useState(false);
	const [currentChat, setCurrentChat] = useState([]);
	// const [mentors, setMentors] = useState([]);
	// const [currentConcern, setCurrentConcern] = useState();
	const [message, setMessage] = useState('');
	const [expanded, setExpanded] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	// const [typing, setTyping] = useState({
	// 	isTyping: false,
	// 	name: ''
	// });

	const ENDPOINT = '172.60.63.82:3001';

	useEffect(() => {
		socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
		socket.emit('join', { chatroom }, () => {
			socket.on('oldChat', data => {
				setCurrentChat(data.data.messages);
			});
		});
	}, [ENDPOINT, chatroom]);

	// useEffect(() => {
	//   socket.emit("fetchMentors", { id: chatroom.room }, () => {
	//     socket.on("assignMentors", ({ user, concern }) => {
	//       let filter = [];
	//       user.filter(e => {
	//         return e.user_id !== userObj.user_id ? filter.push(e) : null;
	//       });
	//       setMentors(filter);
	//       setCurrentConcern(...concern);
	//     });
	//   });
	// }, [chatroom]);

	useEffect(() => {
		if (message.length <= 0) socket.emit('NotTyping', { name: userObj.name });
		socket.on('message', message => {
			setCurrentChat([...currentChat, message]);
		});
		socket.on('displayTyping', ({ name }) => {
			// setTyping({ isTyping: true, name });
		});
		socket.on('displayNotTyping', ({ name }) => {
			// setTyping({ isTyping: false, name: '' });
		});
		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	}, [currentChat, chatroom, message.length, userObj.name]);

	const sendMessage = event => {
		setMessage('');
		event.preventDefault();
		const temp = message.replace(/\n/g, '<br />');
		if (message) {
			socket.emit('sendMessage', { message: temp }, () => setMessage(''));
			socket.emit('NotTyping', { name: userObj.name });
		}
	};

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};
	const toggleEmoji = () => {
		setShowEmoji(!showEmoji);
	};
	const handleClick = e => setAnchorEl(e.currentTarget);
	const handleClose = () => setAnchorEl(null);
	const handleModal = () => setModal(!modal);

	return (
		<Card className={classes.root}>
			<ChatHeader
				classes={classes}
				handleClick={handleClick}
				anchorEl={anchorEl}
				handleClose={handleClose}
				handleModal={handleModal}
				chatroom={chatroom}
			/>
			<Divider />
			<ChatBody
				classes={classes}
				currentChat={currentChat}
				chatroom={chatroom}
				userObj={userObj}
				darkMode={darkMode}
			/>
			{chatroom.concern_status !== 'done' ? (
				<ChatAction
					showEmoji={showEmoji}
					setMessage={setMessage}
					message={message}
					toggleEmoji={toggleEmoji}
					userObj={userObj}
					socket={socket}
					expanded={expanded}
					classes={classes}
					handleExpandClick={handleExpandClick}
					sendMessage={sendMessage}
					darkMode={darkMode}
				/>
			) : (
				''
			)}
			{/* <ChatModal
        modal={modal}
        handleModal={handleModal}
        mentors={mentors}
        currentConcern={currentConcern}
        userObj={userObj}
        id={id}
      /> */}
		</Card>
	);
};
export default Chat;
