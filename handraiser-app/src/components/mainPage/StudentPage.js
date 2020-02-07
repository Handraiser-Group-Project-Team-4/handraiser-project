import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import jwtToken from '../tools/jwtToken';
import MainpageTemplate from '../tools/MainpageTemplate';
import CohortList from '../cohort/CohortList';
export default function StudentPage({ location }) {
	const userObj = jwtToken();
	const handleMentor = () => {
		axios({
			method: `patch`,
			url: `/api/pending/${userObj.user_id}`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				setTimeout(() => {
					alert(`Request Successfully Sent.`);
				}, 500);
				console.log(res);
			})
			.catch(err => console.log(err));
	};
	if (userObj) {
		if (userObj.user_role_id === 1) return <Redirect to="/admin-page" />;
		else if (userObj.user_role_id === 2) return <Redirect to="/mentor-page" />;
	} else return <Redirect to="/" />;
	return (
		<MainpageTemplate>
			<div
				style={{
					display: `flex`,
					flexDirection: `column`,
					justifyContent: `center`,
					alignItems: `center`,
					height: `100vh`
				}}
			>
				<h1>THIS IS WHERE THE COHORT LIST IS LOCATED</h1>
				<CohortList />
				{location.state && location.state.isNew && (
					<button onClick={handleMentor}>I'am a Mentor</button>
				)}
			</div>
		</MainpageTemplate>
	);
}
