import React from 'react';
import jwtToken from './components/tools/assets/jwtToken';
import axios from 'axios';
export default function DarkMode() {
	const [darkMode, setDarkMode] = React.useState(false);
	const userObj = jwtToken();
	React.useEffect(() => {
		if (userObj) {
			axios({
				method: 'get',
				url: `/api/users/${userObj.user_id}`,
				headers: {
					Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
				}
			})
				.then(res => {
					setDarkMode(res.data.dark_mode);
				})
				.catch(err => {
					console.log(err);
				});
		}
	}, [userObj]);
	return { darkMode, setDarkMode };
}
