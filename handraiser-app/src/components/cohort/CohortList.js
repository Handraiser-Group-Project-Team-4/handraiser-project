import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import jwtToken from '../tools/assets/jwtToken';
import io from 'socket.io-client';

let socket;
export default function CohortList({ mentor }) {
	const ENDPOINT = 'localhost:3001';
	const userObj = jwtToken();
	const history = useHistory();
	const [cohorts, setCohorts] = useState([]);
	const [isKey, setIsKey] = useState({
		key: '',
		open: false,
		classroomObj: {},
		error: false
	});

	useEffect(() => {
		socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
	}, [ENDPOINT]);

	useEffect(() => {
		socket.on('fetchCohort', data => {
			// console.log(data)
			// setCohorts([...cohorts, data])
			renderCohorts();
		});

		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	});

	useEffect(() => {
		renderCohorts();
		return () => {};
	}, []);

	const renderCohorts = () => {
		axios({
			method: `get`,
			url: '/api/cohorts',
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				// console.log(res)
				setCohorts(res.data);
			})
			.catch(err => {
				console.log(err);
			});
	};

	const handleCohort = x => {
		// console.log(`clicked`, x)
		axios({
			method: `get`,
			url: `/api/cohort-check/${x.class_id}?user_id=${userObj.user_id}`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				// console.log(res)
				if (res.data.length === 0)
					setIsKey({ ...isKey, open: true, classroomObj: x });
				else {
					history.push(`/cohort/${x.class_id}`);
				}
			})
			.catch(err => {
				console.log(err);
			});
	};

	const handleSubmitKey = isKey => {
		const input_key = isKey.key;
		const class_id = isKey.classroomObj.class_id;

		let date = new Date();
		let newDate = date.toLocaleString();

		axios({
			method: 'post',
			url: `/api/submit-key`,
			data: {
				class_id,
				user_id: userObj.user_id,
				date_joined: newDate,
				input_key
			},
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				// console.log(res)
				alert('Congrats you enter the correct Key!');
				history.push(`/cohort/${class_id}`);
			})
			.catch(err => {
				console.log(err);
				setIsKey({ ...isKey, error: true });
			});
	};

	return (
		<>
			{isKey.open && (
				<>
					<h3>{isKey.classroomObj.class_title}</h3>
					<input
						type="text"
						placeholder="Enter Class key here..."
						value={isKey.key}
						onChange={e => setIsKey({ ...isKey, key: e.target.value })}
					/>
					{isKey.error && (
						<h5 style={{ color: `red`, margin: `0` }}>Invalid Key!</h5>
					)}
					<div style={{ display: `flex` }}>
						<button onClick={() => handleSubmitKey(isKey)}>Submit</button>
						<button onClick={() => setIsKey({ ...isKey, open: false })}>
							Cancel
						</button>
					</div>
				</>
			)}
			<div style={{ display: `flex` }}>
				{cohorts.map((x, i) => (
					<div
						onClick={() =>
							x.class_status === 'true'
								? handleCohort(x)
								: alert('Sorry This class is closed')
						}
						key={i}
						style={{
							background: `white`,
							padding: `20px`,
							margin: `10px`,
							borderRadius: `5px`,
							cursor: `pointer`,
							width: `100%`
						}}
					>
						<h3>{x.class_title}</h3>
						<p>{x.class_description}</p>
						{x.class_status === 'true' ? (
							<span
								style={{
									background: `green`,
									color: `white`,
									padding: `2px 4px`,
									borderRadius: `3px`
								}}
							>
								active
							</span>
						) : (
							<span
								style={{
									background: `red`,
									color: `white`,
									padding: `2px 4px`,
									borderRadius: `3px`
								}}
							>
								close
							</span>
						)}
					</div>
				))}
			</div>
		</>
	);
}
