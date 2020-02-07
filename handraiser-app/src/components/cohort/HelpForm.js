import React, { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { UserContext } from './CohortPage';

export default function Help() {
	const [value, setValue] = useState('');
	const [isTrue, setIsTrue] = useState(false);
	const { id, data, setData, user, socket } = useContext(UserContext);

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
	}, [data, user, isTrue]);

	const handleClick = () => {
		Axios({
			method: 'post',
			url: `/api/concern`,
			data: {
				class_id: id,
				mentor_id: null,
				student_id: user.user_id,
				concern_title: value,
				concern_status: 'pending'
			},
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				let arr = data;
				arr.push(res.data);
				setData(arr);
				socket.emit('concern', arr, () => setValue(''));
				setIsTrue(true);
			})
			.catch(err => console.log(err));
	};

	if (!user) {
		return null;
	}

	return (
		<>
			{user.user_role_id === 3 ? (
				<>
					<button
						onClick={() => {
							handleClick();
						}}
						disabled={isTrue}
					>
						Need help
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
			) : null}
		</>
	);
}
