import React, { useContext } from 'react';
import Students from './Students';
import { UserContext } from './CohortPage';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

export default function NeedHelp(props) {
	const classes = useStyles();
	const { id, data } = useContext(UserContext);

	return (
		<Paper className={classes.paper}>
			<Typography variant="h5" style={{ padding: 10 }}>
				Need Help
			</Typography>
			<Divider />
			<List className={classes.list}>
				{data
					? data.map((concern, index) => {
							if (concern.concern_status === 'pending') {
								return (
									<Students
										key={index}
										room_id={id}
										id={concern.concern_id}
										student_id={concern.student_id}
										status={concern.concern_status}
										text={concern.concern_title}
										index={index}
									/>
								);
							} else return null;
					  })
					: ''}
			</List>
		</Paper>
	);
}

const useStyles = makeStyles(theme => ({
	paper: {
		padding: theme.spacing(2),
		textAlign: 'left'
	},
	list: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper
	},
	inline: {
		display: 'inline',
		color: '#000'
	}
}));
