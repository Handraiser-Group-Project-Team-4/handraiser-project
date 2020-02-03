import React, { useState } from 'react';
import jwtToken from '../tools/jwtToken';
import Axios from 'axios';
import Data from './Data';

export default function Help(props) {
	const userObj = jwtToken();
	const [value, setValue] = useState('');
	const { isTrue, setIsTrue } = Data(props.id, props.socket);

	const handleClick = () => {
		Axios({
			method: 'post',
			url: `/api/concern`,
			data: {
				class_id: props.id,
				student_id: userObj.user_id,
				concern_title: value,
				concern_status: 'pending'
			},
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				setValue('');
				setIsTrue(true);
			})
			.catch(err => console.log(err));
	};

	return (
		<>
			{userObj ? (
				userObj.user_role_id === 3 ? (
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
