import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import {
	Paper,
	Grid,
	TextField,
	InputAdornment,
	Card,
	CardContent,
	List,
	Typography
} from '@material-ui/core';

//ICONS
import SearchIcon from '@material-ui/icons/Search';

import { DarkModeContext } from '../../../App';

let socket;
const Logs = ({
	classes,
	Timeline,
	changeHandler,
	logs,
	search,
	id,
	setLogs
}) => {
	const ENDPOINT = '172.60.63.82:3001';
	const { darkMode } = useContext(DarkModeContext);
	const [searchResult, setSearchResult] = useState([]);

	useEffect(() => {
		socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
		socket.emit('joinConcern', { id }, () => {
			socket.on('fetchOldLogs', ({ data }) => {
				setLogs(data);
			});
		});
	}, [ENDPOINT, id, setLogs]);

	useEffect(() => {
		let filter = [];
		if (search) {
			logs.filter(log => {
				const regex = new RegExp(search, 'gi');
				return log.action_made.match(regex) || log.date_time.match(regex)
					? filter.push(log)
					: null;
			});
			setSearchResult(filter);
		} else {
			setSearchResult([]);
		}
	}, [search, logs]);

	return (
		<Paper className={classes.paperr} elevation={2}>
			<Grid
				container
				spacing={0}
				className={classes.gridContainerr + ' ' + classes.banner}
				style={{
					backgroundColor: darkMode ? '#333' : null,
					// paddingTop: 0,
					marginTop: -50,
					height: '100vh'
				}}
			>
				<Grid container item xs={10} sm={10} md={5} lg={5}>
					<form
						noValidate
						autoComplete="off"
						className={classes.searchform}
						style={{
							width: '100%',
							display: 'flex',
							alignItems: 'flex-end',
							justifyContent: 'flex-end',
							paddingBottom: 10
						}}
					>
						<TextField
							id="outlined-search"
							label="Search field"
							type="search"
							size={'small'}
							name="search"
							variant="outlined"
							onChange={changeHandler}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<SearchIcon />
									</InputAdornment>
								)
							}}
						/>
					</form>
					<Card className={classes.cardLogs}>
						<CardContent>
							<Timeline>
								<ul className={classes.timeline}>
									{searchResult.length ? (
										searchResult.map((log, i) => (
											<li className="timeline-item" key={i}>
												<div className="timeline-info">
													<span>{log.date_time}</span>
												</div>
												<div className="timeline-marker"></div>
												<div className="timeline-content">
													{/* <Avatar alt="Remy Sharp" /> */}
													<h3 className="timeline-title">{log.action_made}</h3>
												</div>
											</li>
										))
									) : logs.length && !search ? (
										logs.map((log, i) => (
											<li className="timeline-item" key={i}>
												<div className="timeline-info">
													<span>{log.date_time}</span>
												</div>
												<div className="timeline-marker"></div>
												<div className="timeline-content">
													{/* <Avatar alt="Remy Sharp" /> */}
													<h3 className="timeline-title">{log.action_made}</h3>
												</div>
											</li>
										))
									) : (
										<List
											style={{
												padding: '40px'
											}}
										>
											<Typography
												gutterBottom
												variant="h6"
												component="h6"
												style={{
													textAlign: 'center',
													fontWeight: '300'
												}}
											>
												No Logs Found
											</Typography>
										</List>
									)}
								</ul>
							</Timeline>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Paper>
	);
};
export default Logs;
