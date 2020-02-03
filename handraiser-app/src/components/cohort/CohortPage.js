import React from 'react';
import MainpageTemplate from '../tools/MainpageTemplate';
import { Link } from 'react-router-dom';
import NeedHelp from './NeedHelp';
import BeingHelp from './BeingHelp';
import ChatRoom from './ChatRoom';
import io from 'socket.io-client';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Help from './Help';

export default function CohortPage(props) {
	const classes = useStyles();
	const ENDPOINT = 'localhost:4000';
	let socket = io(ENDPOINT);

	return (
		<MainpageTemplate>
			<Link to="/">Go Back</Link>

			<div
				style={{
					height: `100vh`
				}}
			>
				<div className={classes.root}>
					<Grid container spacing={3}>
						<Grid item xs={6} lg={3}>
							<Help id={props.match.params.id} socket={socket} />
							<NeedHelp id={props.match.params.id} socket={socket} />
							<BeingHelp id={props.match.params.id} socket={socket} />
						</Grid>
						<Grid item xs={6} lg={9}>
							<ChatRoom />
						</Grid>
					</Grid>
				</div>
			</div>
		</MainpageTemplate>
	);
}

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		padding: 50
	}
}));
