import React, { useState, useEffect, Fragment, useContext } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import io from "socket.io-client";

// COMPONENTS
import jwtToken from '../tools/assets/jwtToken';
import handraise from '../../images/handraise.png';
import { DarkModeContext } from '../../App';
import Team from './Team';
import UsersModal from '../tools/UsersModal'
// import Unnamed from "./unnamed.jpg";
// import Handraiser from "./Handraiser";
// import ListOfCohorts from "./ListOfCohorts";

// MATERIAL-UI
import {
	AppBar,
	CssBaseline,
	Drawer,
	Hidden,
	IconButton,
	ListItem,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
	Tab,
	Box,
	Tabs,
	Switch,
	makeStyles, 
	useTheme 
} from '@material-ui/core';

// ICONS
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import DnsIcon from '@material-ui/icons/Dns';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

let socket;
export default function MainpageTemplate({
	children,
	container,
	tabIndex = 0
}) {
	const ENDPOINT = "localhost:3001";
	const userObj = jwtToken();
	const [user, setUser] = useState();
	const classes = useStyles();
	const theme = useTheme();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
	const [value, setValue] = React.useState(0);
	const handleChanges = (e, newValue) => setValue(newValue);
	const history = useHistory();
	const { darkMode, setDarkMode } = useContext(DarkModeContext);
	const [notify, setNotify] = useState({open: false, title: "", buttonText: "", type: "", modalTextContent: ""});

	const handleLogout = () => {
		setNotify({...notify, open: false})	
		axios({
			method: `patch`,
			url: `/api/logout/${userObj.user_id}`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				console.log(res);
			})
			.catch(err => {
				console.log(err);
			});
		sessionStorage.clear();
	};

	useEffect(() => {
		socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
	  }, [ENDPOINT]);
	
	useEffect(() => {
		socket.on('mentorToStudent', user_id => {
			if (userObj.user_id === user_id)
				// alert(`Your role has been change to Student Please Logout to see the changes!`);
				setNotify({
					open: true, 
					title: "Your role has been change to Student Please Logout to see the changes!", 
					buttonText: "Logout", 
					type: "mentorToStudent"
				})
		});

		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	});
	useEffect(() => {
		socket.on("studentToMentor", user_id => {
		  if (userObj.user_id === user_id)
			// alert(`Your role has been change to Mentor. Please Logout to see the changes!`);
			setNotify({
				open: true, 
				title: "Your role has been change to Mentor. Please Logout to see the changes!", 
				buttonText: "Logout", 
				type: "studentToMentor"
			})
		});
		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	});
	
	useEffect(() => {
		socket.on("notifyUser", ({ user_id, approval_status }) => {
			if (userObj.user_id === user_id) {
				if (approval_status.user_approval_status_id === 1)
					// alert(`Your Request has been Approve. Please Logout to see the changes!`);
					setNotify({
						open: true, 
						title: "Your Request to be a Mentor has been Approve. Please Logout to see the changes!", 
						buttonText: "Logout", 
						type: "notifyUserApprove"
					})

				if (approval_status.user_approval_status_id === 3)
					// alert(`Your Request has been Disapprove. Reason: ${approval_status.reason_disapproved}`);
					setNotify({
						open: true, 
						title: `Your Request to be a Mentor has been Disapprove.`, 
						modalTextContent: `Reason: ${approval_status.reason_disapproved}`,
						buttonText: "Agree", 
						type: "notifyUserDisapprove"
					})
			}
		});

		return () => {
			socket.emit("disconnect");
			socket.off();
		};
	});

	useEffect(() => {
		let isCancelled = false;
		axios({
			method: 'get',
			url: `/api/users/${userObj && userObj.user_id}`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				// console.log(res.data)
				if (!isCancelled) setUser(res.data);
			})
			.catch(err => {
				console.log(err);
			});

		return () => {
			isCancelled = true;
		};
	}, []);

	const handleDarkMode = async () => {
		let res = await axios({
			method: 'patch',
			url: `/api/darkmode/${user.user_id}`,
			data: { dark_mode: !darkMode },
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		});
		setDarkMode(!darkMode);
	};

	if (!userObj) return <Redirect to="/" />;

	const drawer = (
		<div>
			{user && (
				<div className={classes.firstToolbar}>
					<img src={user.avatar} className={classes.studentImg} alt="" />
					<Typography className={classes.studentImgButton}>
						{user.firstname} {user.lastname}
					</Typography>
				</div>
			)}
			<Tabs
				orientation="vertical"
				value={tabIndex}
				onChange={handleChanges}
				className={classes.tabs}
			>
				<Tab
					label={
						<ListItem
							onClick={() => history.push('/student-page')}
							button
							className={classes.listItemButton}
						>
							<ListItemIcon
								style={{
									color: 'white'
								}}
							>
								<DnsIcon />
							</ListItemIcon>
							<ListItemText
								primary="Cohorts"
								className={classes.listItemText}
							/>
						</ListItem>
					}
					// {...a11yPropss(0)}
				/>
				<Tab
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
							<ListItemText primary="Team" className={classes.listItemText} />
						</ListItem>
					}
				/>
				<Tab
					label={
						<ListItem
							to="/"
							renderas={Link}
							onClick={handleLogout}
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
							<ListItemText primary="Logout" className={classes.listItemText} />
						</ListItem>
					}
				/>
				<Tab
					label={
						<ListItem className={classes.listItemButton}>
							<ListItemIcon
								style={{
									color: 'white'
								}}
							>
								{darkMode ? <Brightness4Icon /> : <Brightness7Icon />}
							</ListItemIcon>
							<ListItemText primary={darkMode ? 'Dark' : 'Light'} />
							<Switch
								checked={darkMode}
								onChange={handleDarkMode}
								value="checkedB"
								color="default"
							/>
						</ListItem>
					}
				/>
			</Tabs>
		</div>
	);

	return (
		<Fragment>
			<CssBaseline />
			<div className={classes.mainDiv}>
				<Hidden only={['lg', 'md', 'xl']}>
					<AppBar position="fixed" className={classes.appBar}>
						<Toolbar>
							<IconButton
								color="inherit"
								aria-label="open drawer"
								edge="start"
								onClick={handleDrawerToggle}
								className={classes.menuButton}
							>
								<MenuIcon />
							</IconButton>
							<Typography variant="h6" noWrap>
								Handraiser
							</Typography>
						</Toolbar>
					</AppBar>
				</Hidden>
				<nav className={classes.drawer}>
					<Hidden smUp implementation="css">
						<Drawer
							container={container}
							variant="temporary"
							anchor={theme.direction === 'rtl' ? 'right' : 'left'}
							open={mobileOpen}
							onClose={handleDrawerToggle}
							classes={{
								paper: classes.drawerPaper
							}}
							ModalProps={{
								keepMounted: true
							}}
						>
							{drawer}
						</Drawer>
					</Hidden>
					<Hidden smDown implementation="css">
						<Drawer
							classes={{
								paper: classes.drawerPaper
							}}
							variant="permanent"
							open
						>
							{drawer}
						</Drawer>
					</Hidden>
				</nav>
				<main className={classes.content}>
					<Hidden only={['lg', 'md', 'xl']}>
						<div className={classes.toolbar} />
					</Hidden>
					<div className={classes.tabPanel}>{children}</div>
				</main>
			</div>
		{notify.open&& 
			<UsersModal 
				open={notify.open}
				title={notify.title}
				modalTextContent = {notify.modalTextContent}
				handleClose={() => setNotify({...notify, open: false})}
				handleSubmit={handleLogout}
				type={notify.type}
				buttonText = {notify.buttonText}
				/>
		}
		</Fragment>
	);
}

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
	tabPanel: {
		'&>div': {
			padding: 0
		}
	},
	mainDiv: {
		display: 'flex'
	},
	drawer: {
		[theme.breakpoints.up('md')]: {
			width: drawerWidth,
			flexShrink: 0
		}
	},
	appBar: {
		[theme.breakpoints.up('md')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth
		},
		backgroundColor: '#673ab7'
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('md')]: {
			display: 'none'
		}
	},
	toolbar: theme.mixins.toolbar,
	firstToolbar: {
		...theme.mixins.toolbar,
		minHeight: '12rem!important',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	drawerPaper: {
		width: drawerWidth,
		backgroundColor: '#673ab7'
	},
	content: {
		flexGrow: 1
	},
	'@global': {
		body: {
			fontFamily: "'Rubik', sans-serif"
		}
	},
	listItemText: {
		'& > span': {
			fontFamily: "'Rubik', sans-serif",
			fontWeight: 500,
			color: 'white',
			fontSize: 20
		}
	},
	active: {
		'& > span': {
			color: '#f08080!important'
		}
	},
	activeBorder: {
		borderLeft: '4px solid #f08080',
		textTransform: 'uppercase',
		fontFamily: "'Rubik', sans-serif",
		fontWeight: 500,
		color: '#9ea0b8'
	},
	studentImg: {
		borderRadius: '50%',
		border: '5px solid white',
		width: '85px!important',
		height: '85px',
		cursor: 'pointer'
	},
	studentImgButton: {
		fontFamily: "'Rubik', sans-serif",
		fontWeight: 700,
		textTransform: 'capitalize',
		color: 'white',
		fontSize: '1.25rem',
		paddingTop: '5px',
		wordBreak: 'break-word',
		textAlign: 'center'
	},
	navigList: {
		textTransform: 'uppercase',
		fontFamily: "'Rubik', sans-serif",
		fontWeight: 500,
		color: '#9ea0b8'
	},
	listItemImg: {
		width: 35,
		height: 35,
		backgroundColor: '#fefefe',
		borderRadius: '10% 30% 50% 70%'
	},
	listItemButton: {
		textTransform: 'uppercase',
		fontFamily: "'Rubik', sans-serif",
		fontWeight: 500,
		color: '#9ea0b8'
	},
	divider: {
		backgroundColor: '#ffe4c4'
	},
	tabs: {
		borderRight: `1px solid ${theme.palette.divider}`,
		'& button': {
			padding: 0
		}
	}
}));
function a11yPropss(index) {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`
	};
}
function TabPanel({ children, value, index, ...other }) {
	return (
		<Typography
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</Typography>
	);
}
