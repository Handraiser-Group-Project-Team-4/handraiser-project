import React from 'react';
import Students from './Students';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Data from './Data';

export default function NeedHelp(props) {
	const classes = useStyles();

	const { data, setData } = Data(props.id, 'pending', props.socket);

	return (
		<Paper className={classes.paper}>
			<Typography variant="h5" style={{ padding: 10 }}>
				Need Help
			</Typography>
			<Divider />
			<List className={classes.list}>
				{data.map((student, index) => {
					if (student.concern_status === 'pending') {
						return (
							<Students
								key={index}
								id={student.concern_id}
								student_id={student.student_id}
								status={student.concern_status}
								data={data}
								setData={setData}
								index={index}
							/>
						);
					} else return null;
				})}
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
