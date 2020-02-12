import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { DarkModeContext } from '../../App';
import { UserContext } from './CohortPage';
import jwtToken from '../tools/assets/jwtToken';
import Switch from '@material-ui/core/Switch';

let socket;
export default function Help() {
	const [value, setValue] = useState('');
	const [isTrue, setIsTrue] = useState(false);
	const { darkMode, setDarkMode } = useContext(DarkModeContext);
	const { id, data, user } = useContext(UserContext);
	const userObj = jwtToken();
	const ENDPOINT = 'localhost:3001';

	useEffect(() => {
		socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
	}, [ENDPOINT]);

	const sendConcern = event => {
		event.preventDefault();
		const concern = {
			class_id: id,
			mentor_id: null,
			student_id: userObj.user_id,
			concern_title: value,
			concern_status: 'pending'
		};
		setValue('');
		socket.emit('sendConcern', { concern }, () => {});
	};

	useEffect(() => {
		if (user) {
			let isNull = false;
			data.map(student => {
				if (user.user_id === student.student_id) {
					isNull = true;
				}
				return isNull;
			});
			setIsTrue(isNull);
		}
	});

	const handleDarkMode = async () => {
		let res = await axios({
			method: 'patch',
			url: `/api/darkmode/${user.user_id}`,
			data: { dark_mode: !darkMode },
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		});
		setDarkMode(!darkMode);
	};

	return (
		<>
			{user ? (
				user.user_role_id === 3 ? (
					<>
						<button onClick={e => sendConcern(e)} disabled={isTrue}>
							Help
						</button>
						<input
							value={value}
							type="text"
							onChange={e => {
								setValue(e.target.value);
							}}
							disabled={isTrue}
						/>
					</>
				) : null
			) : null}

			<Switch
				checked={darkMode}
				onChange={handleDarkMode}
				value="darkmode"
				color="primary"
				inputProps={{ 'aria-label': 'primary checkbox' }}
			/>
		</>
	);
}
