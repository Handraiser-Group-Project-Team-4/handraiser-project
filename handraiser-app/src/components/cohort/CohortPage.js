import React, { createContext, useState, useEffect } from 'react';
import MainpageTemplate from '../tools/MainpageTemplate';
import { Link } from 'react-router-dom';
import Help from './Help';
import NeedHelp from './NeedHelp';
import BeingHelp from './BeingHelp';
import Chat from '../Chat/Chat';
import Axios from 'axios';
import jwtToken from '../tools/jwtToken';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

export const UserContext = createContext(null);

export default function CohortPage(props) {
	const classes = useStyles();
	const userObj = jwtToken();
	const { id } = props.match.params;
	const [data, setData] = useState([]);
	const [user, setUser] = useState();

	useEffect(() => {
		Axios({
			method: 'get',
			url: `/api/concern/${id}`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				setData(res.data);
			})
			.catch(err => console.log(err));
		Axios({
			method: 'get',
			url: `/api/users/${userObj.user_id}`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				setUser(res.data);
			})
			.catch(err => {
				console.log(err);
			});
	}, []);

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
							<UserContext.Provider
								value={{ id, data, setData, user, setUser }}
							>
								<Help />
								<NeedHelp />
								<BeingHelp />
							</UserContext.Provider>
						</Grid>
						<Grid item xs={6} lg={9}>
							<Chat />
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
