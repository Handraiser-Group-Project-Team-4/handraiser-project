import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import { UserContext } from './CohortPage';

import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import HelpIcon from '@material-ui/icons/Help';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';

export default function Students(props) {
	const classes = useStyles();
	const { id, index, status, student_id, text } = props;
	const [student, setStudent] = useState([]);

	const { data, setData, user } = useContext(UserContext);

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

	const handleUpdate = value => {
		let mentor_id = value === 'onprocess' ? user.user_id : null;
		Axios({
			method: 'patch',
			url: `/api/concern/${id}`,
			data: { concern_status: value, mentor_id },
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				let arr = [];
				data.filter((student, n) => {
					if (index === n) {
						student.concern_status = value;
					}
					return arr.push(student);
				});
				setData(arr);
			})
			.catch(err => console.log(err));
	};

	const handleDelete = () => {
		Axios({
			method: 'delete',
			url: `/api/concern/${id}`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				let arr = [];
				data.filter((student, n) => {
					if (index !== n) {
						return arr.push(data[n]);
					}
					return arr;
				});
				setData(arr);
			})
			.catch(err => console.log(err));
	};
	if (!user) {
		return null;
	}
	return (
		<>
			<ListItem alignItems="flex-start">
				<ListItemAvatar>
					<Avatar alt={student.firstname} src={student.avatar} />
				</ListItemAvatar>
				<ListItemText
					primary={`${student.firstname} ${student.lastname}`}
					secondary={
						<React.Fragment>
							{`Problem: ${text}`}
							<Typography
								component="span"
								variant="body2"
								className={classes.inline}
							></Typography>
						</React.Fragment>
					}
				/>
				{status === 'pending' && user.user_role_id === 2 ? (
					<HelpIcon
						onClick={() => {
							handleUpdate('onprocess');
						}}
					/>
				) : status === 'onprocess' && user.user_role_id === 2 ? (
					<>
						<CheckCircleIcon style={{ marginLeft: 10 }} />

						<RemoveCircleIcon
							style={{ marginLeft: 10 }}
							onClick={() => {
								handleUpdate('pending');
							}}
						/>
					</>
				) : status === 'pending' &&
				  user.user_role_id === 3 &&
				  user.user_id === student.user_id ? (
					<DeleteIcon
						onClick={() => {
							handleDelete();
						}}
					/>
				) : null}
			</ListItem>
			<Divider variant="inset" component="li" />
		</>
	);
}

const useStyles = makeStyles(theme => ({
	inline: {
		display: 'inline',
		color: '#000'
	}
}));
