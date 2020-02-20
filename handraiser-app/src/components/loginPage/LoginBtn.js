import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import googleIcon from '../../images/google-icon.svg';
import axios from 'axios';
import jwtToken from '../tools/assets/jwtToken';
import { DarkModeContext } from '../../App';
import {newUserContext} from "../../routes"

export default function LoginBtn() {
	const userObj = jwtToken();
	const {setisNew} = useContext(newUserContext);
	const { setDarkMode } = useContext(DarkModeContext);
	const [user, setUser] = useState({
		loginSuccess: false,
		role: null
	});
	const responseGoogle = response => {
		// console.log(response)
		axios({
			method: 'get',
			url: `/api/users?user_id=${response.profileObj.googleId}`
		})
			.then(res => {
				// console.log(res.data)
				if (res.data[0] !== undefined)
					sessionStorage.setItem('accessToken', res.data.token);
				if (res.data[0] === undefined) {
					axios({
						method: `post`,
						url: `/api/users`,
						data: {
							user_id: response.profileObj.googleId,
							avatar: response.profileObj.imageUrl,
							email: response.profileObj.email,
							firstname: response.profileObj.givenName,
							lastname: response.profileObj.familyName
						},
						headers: {
							Authorization: 'Bearer ' + res.data.token
						}
					})
						.then(res => {
							// console.log(res);
							sessionStorage.setItem('accessToken', res.data.token);
							setUser({ ...user, loginSuccess: true});
							setisNew(true)
						})
						.catch(err => console.log(err));
				} else {
					setUser({
						...user,
						loginSuccess: true,
						role: res.data[0].user_role_id
					});
					setDarkMode(res.data[0].dark_mode);
				}
			})
			.catch(err => {
				console.log(err);
			});
	};
	if ((userObj || user.loginSuccess) && user.role === 1)
		return <Redirect to="/admin-page" />;
	else if ((userObj || user.loginSuccess) && user.role === 2)
		return <Redirect to="/mentor-page" />;
	else if (userObj || user.loginSuccess)
		return (<Redirect to= "/student-page" />);
		
	return (
		<GoogleLogin
			clientId={process.env.REACT_APP_CLIENT_ID}
			buttonText="Login with Google"
			onSuccess={responseGoogle}
			onFailure={response => console.log(response)}
			cookiePolicy={'single_host_origin'}
			render={renderProps => (
				<button
					onClick={renderProps.onClick}
					disabled={renderProps.disabled}
					style={{
						backgroundColor: 'white',
						color: '#7048c6',
						fontFamily: "'Open Sans', sans-serif",
						fontSize: 20,
						fontWeight: 'bold',
						borderRadius: '24px',
						padding: '10px 16px',
						border: 'none',
						display: 'flex',
						alignItems: 'center',
						cursor: `pointer`,
						boxShadow:
							'0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)'
					}}
				>
					<img
						src={googleIcon}
						style={{
							width: '20px',
							height: '20px',
							marginRight: '10px'
						}}
						alt="google-logo"
					/>
					GET STARTED
				</button>
			)}
		/>
	);
}
