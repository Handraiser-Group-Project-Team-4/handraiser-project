import React, { useContext } from 'react';

// COMPONENTS
import Students from './Students';
import { UserContext } from './CohortPage';
import { DarkModeContext } from '../../../App';

// MATERIAL-UI
import { 
	List, 
	Typography, 
	Card, 
	CardContent, 
	Chip 
} from '@material-ui/core';


export default function NeedHelps({ classes }) {
	const { id, data, handleConcernCount } = useContext(UserContext);
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
					Need Help
					<Chip label={handleConcernCount('pending')} />
				</Typography>
				{data && data.some(concern => concern.concern_status === 'pending') ? (
					<List className={classes.roots}>
						{data.map(
							(concern, index) =>
								concern.concern_status === 'pending' && (
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
								)
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
							No one is requesting Help at the moment.
						</Typography>
					</List>
				)}
			</CardContent>
		</Card>
	);
}

// const useStyles = makeStyles(theme => ({
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: "left"
//   },
//   list: {
//     width: "100%",
//     maxWidth: 360,
//     backgroundColor: theme.palette.background.paper
//   },
//   inline: {
//     display: "inline",
//     color: "#000"
//   }
// }));
