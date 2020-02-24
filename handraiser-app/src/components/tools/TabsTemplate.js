import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

// import { newUserContext } from "../../routes";
import { DarkModeContext } from '../../App';

import { GoogleLogout } from 'react-google-login';
import jwtToken from '../tools/assets/jwtToken';
import {
	Tabs,
	Switch,
	ListItem,
	ListItemIcon,
	ListItemText,
	Tab,
	Backdrop,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Slide
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';

// let socket;
export default function TabsTemplate({
	children,
	tabIndex,
	classes,
	open,
	modal,
	setModal,
	setOpen,
	handleLogout
}) {
	const userObj = jwtToken();
	const history = useHistory();
	const { darkMode, setDarkMode } = useContext(DarkModeContext);

	const handleDarkMode = async () => {
		await axios({
			method: 'patch',
			url: `/api/darkmode/${userObj.user_id}`,
			data: { dark_mode: !darkMode },
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		});
		setDarkMode(!darkMode);
	};

	// const handleLogout = () => {
	//   axios({
	//     method: `patch`,
	//     url: `/api/logout/${userObj.user_id}`,
	//     headers: {
	//       Authorization: "Bearer " + sessionStorage.getItem("accessToken")
	//     }
	//   })
	//     .then(res => {
	//       console.log(res);
	//     })
	//     .catch(err => {
	//       console.log(err);
	//     });
	//     socket.emit('activeUser', () => {
	//       socket.on('displayActiveUser', ({userIsActive}) => {
	//         console.log(userIsActive)
	//         setActiveUsers(userIsActive)
	//       })
	//     })
	//   history.push('/')
	//   sessionStorage.clear();
	// };

	return (
		<>
			<Tabs
				orientation="vertical"
				value={tabIndex}
				className={classes.tabs}
				style={{ position: 'relative', height: 'calc(100vh - 250px)' }}
			>
				<Tab
					onClick={handleDarkMode}
					style={{ padding: 0 }}
					label={
						<ListItem className={classes.listItemButton}>
							<ListItemIcon
								style={{
									color: 'white'
								}}
							>
								{darkMode ? <Brightness4Icon /> : <Brightness7Icon />}
							</ListItemIcon>
							<ListItemText
								className={classes.listItemText}
								primary={darkMode ? 'Dark' : 'Light'}
							/>
							<Switch
								checked={darkMode}
								onChange={handleDarkMode}
								value="checkedB"
								color="default"
							/>
						</ListItem>
					}
				/>
				{children}
				<Tab
					style={{ padding: 0 }}
					value="team"
					label={
						<ListItem
							onClick={() => history.push('/team')}
							button
							className={classes.listItemButton}
						>
							<ListItemIcon
								style={{
									color: 'white'
								}}
							>
								<PeopleOutlineIcon />
							</ListItemIcon>
							<ListItemText primary="About" className={classes.listItemText} />
						</ListItem>
					}
					{...a11yProps('team')}
				/>
				<Tab
					style={{ padding: 0 }}
					label={
						<ListItem
							to="/"
							renderas={Link}
							onClick={() => setModal(true)}
							button
							className={classes.listItemButton}
						>
							<ListItemIcon
								style={{
									color: 'white'
								}}
							>
								<ExitToAppIcon />
							</ListItemIcon>
							<ListItemText
								primary={
									<GoogleLogout
										render={renderProps => (
											<p style={{ margin: `0` }}>Logout</p>
										)}
										clientId={process.env.REACT_APP_CLIENT_ID}
										buttonText="Logout"
										onLogoutSuccess={handleLogout}
									></GoogleLogout>
								}
								className={classes.listItemText}
							/>
						</ListItem>
					}
				/>
			</Tabs>

			<Dialog
				open={modal}
				TransitionComponent={Transition}
				keepMounted
				onClose={() => setModal(false)}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle id="alert-dialog-slide-title">
					{'Confirmation'}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">
						Are you sure you want to logout?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setModal(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={handleLogout} color="primary">
						Log Out
					</Button>
				</DialogActions>
			</Dialog>

			<Backdrop
				className={classes.backdrop}
				open={open}
				onClick={() => setOpen(true)}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`
	};
}

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
