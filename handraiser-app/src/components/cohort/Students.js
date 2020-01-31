import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import jwtToken from '../tools/jwtToken';

import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import HelpIcon from '@material-ui/icons/Help';
import ChatIcon from '@material-ui/icons/Chat';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

export default function Students(props) {
	const userObj = jwtToken();
	const { id, status, student_id, data, setData, index } = props;
	const [student, setStudent] = useState([]);

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

	const hanleAction = concern_status => {
		let mentor_id = concern_status === 'onprocess' ? userObj.user_id : null;
		Axios({
			method: 'patch',
			url: `/api/concern/${id}`,
			data: { concern_status, mentor_id },
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				let arr = [];
				data.filter((student, n) => {
					let {
						concern_id,
						mentor_id,
						student_id,
						class_id,
						concern_title,
						concern_status
					} = student;
					if (index === n) {
						concern_status = concern_status;
					}
					return arr.push({
						concern_id,
						mentor_id,
						student_id,
						class_id,
						concern_title,
						concern_status
					});
				});
				setData(arr);
			})
			.catch(err => console.log(err));
	};

	return (
		<>
			<ListItem alignItems="flex-start">
				<ListItemAvatar>
					<Avatar alt={student.firstname} src={student.avatar} />
				</ListItemAvatar>
				<ListItemText primary={`${student.firstname} ${student.lastname}`} />
				{status === 'pending' && userObj.user_role_id === 2 ? (
					<HelpIcon
						onClick={() => {
							hanleAction('onprocess');
						}}
					/>
				) : status === 'onprocess' && userObj.user_role_id === 2 ? (
					<>
						<ChatIcon style={{ marginLeft: 10 }} />
						<RemoveCircleIcon
							style={{ marginLeft: 10 }}
							onClick={() => {
								hanleAction('pending');
							}}
						/>
					</>
				) : null}
			</ListItem>
			<Divider variant="inset" component="li" />
		</>
	);
}
