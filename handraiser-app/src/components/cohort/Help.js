import React, { useState, useEffect } from 'react';
import jwtToken from '../tools/jwtToken';
import Axios from 'axios';
import Data from './Data';

export default function Help(props) {
	const userObj = jwtToken();
	const [value, setValue] = useState('');
	const [user, setUser] = useState();
	const { isTrue, setIsTrue } = Data(props.id);
	const { data, setData } = props.handleData;

	useEffect(() => {
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
	});

	const handleClick = () => {
		Axios({
			method: 'post',
			url: `/api/concern`,
			data: {
				class_id: props.id,
				mentor_id: null,
				student_id: userObj.user_id,
				concern_title: value,
				concern_status: 'pending'
			},
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				setData([...data, res.data]);
				setValue('');
				setIsTrue(true);
			})
			.catch(err => console.log(err));
	};

	return (
		<>
			{user ? (
				user.user_role_id === 3 ? (
					<>
						<button
							onClick={() => {
								handleClick();
							}}
							disabled={isTrue}
						>
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
		</>
	);
}
