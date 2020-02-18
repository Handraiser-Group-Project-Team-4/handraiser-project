import React, { useContext } from 'react';

// COMPONENTS
import Students from './Students';
import { UserContext } from '../CohortPage';
import { DarkModeContext } from '../../../App';

// MATERIAL-UI
import { List, 
	Typography, 
	Card, 
	CardContent, 
	Chip 
} from '@material-ui/core';

export default function BeingHelp({ classes }) {
	const { id, data, user, handleConcernCount } = useContext(UserContext);
	const { darkMode } = useContext(DarkModeContext);
	return (
		<Card className={classes.cardRootContent}>
			<CardContent className={classes.cardRootContentContent}>
				<Typography
					gutterBottom
					variant="h5"
					component="h2"
					className={classes.cardRootContentTitle}
					style={{
						backgroundColor: darkMode ? '#424242' : null,
						color: darkMode ? '#fff' : null
					}}
				>
					Being Helped
					<Chip label={handleConcernCount('onprocess')} />
				</Typography>
				{data &&
				data.some(concern => concern.concern_status === 'onprocess') ? (
					<List className={classes.roots}>
						{data.map((concern, index) =>
							user &&
							concern.concern_status === 'onprocess' &&
							(concern.mentor_id === user.user_id ||
								concern.student_id === user.user_id) ? (
								<Students
									key={index}
									room_id={id}
									id={concern.concern_id}
									student_id={concern.student_id}
									status={concern.concern_status}
									text={concern.concern_title}
									index={index}
									classes={classes}
									darkMode={darkMode}
								/>
							) : null
						)}
					</List>
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
							// className={classes.cardRootContentTitle}
						>
							The mentor is not entertaining any request at the moment.
						</Typography>
					</List>
				)}
			</CardContent>
		</Card>
	);
}
