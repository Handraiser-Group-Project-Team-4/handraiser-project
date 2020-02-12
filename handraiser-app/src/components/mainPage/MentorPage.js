import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import jwtToken from '../tools/assets/jwtToken';
import io from 'socket.io-client';

import MainpageTemplate from '../tools/MainpageTemplate';
import CohortList from '../cohort/CohortList';
import CreateCohort from '../cohort/CreateCohort';

let socket;
export default function MentorPage() {
	const ENDPOINT = 'localhost:3001';
	const userObj = jwtToken();

	useEffect(() => {
		socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
	}, [ENDPOINT]);

	useEffect(() => {
		socket.on('mentorToStudent', user_id => {
			console.log(user_id, userObj.user_id);
			if (userObj.user_id === user_id)
				alert(
					`Your role has been change to Student Please Logout to see the changes!`
				);
		});

		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	});

	if (userObj) {
		if (userObj.user_role_id === 1) return <Redirect to="/admin-page" />;
		else if (userObj.user_role_id === 3) return <Redirect to="/student-page" />;
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
				<h1>
					THIS IS WHERE THE COHORT LIST IS LOCATED <i>[Mentor Page]</i>
				</h1>
				<CreateCohort />
				<CohortList mentor={true} />
			</div>
		</MainpageTemplate>
	);
}
