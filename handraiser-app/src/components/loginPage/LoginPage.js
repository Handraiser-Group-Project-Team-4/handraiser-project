import React, { useEffect } from 'react';

import {
	makeStyles,
	CssBaseline,
	Typography,
	Container,
	CardMedia,
	Box,
	Grid,
	Hidden
} from '@material-ui/core/';
import { useSnackbar } from 'notistack';

// COMPONENTS
import classroom from '../../images/classroom.png';
import handraise from '../../images/handraise.png';
import bg from '../../images/bg.jpg';
import LoginBtn from './LoginBtn';

export default function LoginPage() {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		if (sessionStorage.getItem('notification')) {
			enqueueSnackbar(sessionStorage.getItem('notification'), {
				variant: 'success',
				anchorOrigin: {
					vertical: 'top',
					horizontal: 'right'
				}
			});
			sessionStorage.removeItem('notification');
		}
	}, [enqueueSnackbar]);

	return (
		<div className={classes.gradient}>
			<CssBaseline />
			<Container fixed>
				<Box boxshadow={3} className={classes.loginBox}>
					<Grid container spacing={0} style={{ height: '100%' }}>
						<Hidden only={['xs', 'sm']}>
							<Grid
								item
								sm={12}
								md={6}
								lg={8}
								className={classes.loginBoxGridOne}
							>
								<CardMedia
									className={classes.loginBoxGridOneCardMedia}
									image={classroom}
								/>
							</Grid>
						</Hidden>
						<Grid
							item
							sm={12}
							md={6}
							lg={4}
							className={classes.loginBoxGridTwo}
						>
							<CardMedia
								boxshadow={3}
								className={classes.loginBoxGridTwoCardMedia}
								image={bg}
							>
								<div className={classes.loginBoxGridTwoCardMediaDiv}>
									<CardMedia
										image={handraise}
										className={classes.loginBoxGridTwoCardMediaDivCardMedia}
									/>
									<Typography
										className={classes.loginBoxGridTwoCardMediaDivTypography}
									>
										HANDRAISER
									</Typography>
								</div>
								<Typography
									className={classes.loginBoxGridTwoCardMediaTypography}
								>
									You can access the Handraiser with your google account
								</Typography>
								{/* <Fab
                  variant="outlined"
                  color="primary"
                  aria-label="add"
                  className={classes.getStarted}
                  style={{
                    backgroundColor: "white",
                    color: "#7048c6",
                    fontFamily: "'Open Sans', sans-serif",
                    fontSize: 20,
                    fontWeight: "bold"
                  }}
                >
                  <CardMedia
                    image={googleIcon}
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "10px"
                    }}
                  />
                  GET STARTED
                </Fab> */}
								<LoginBtn />
							</CardMedia>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</div>
	);
}

const useStyles = makeStyles(theme => ({
	gradient: {
		overflow: 'auto',
		background: 'linear-gradient(to right, #c24f2a, #68bceb, #6348d0)',
		minHeight: '100vh',
		height: '100%',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	loginBox: {
		background: '#60b6e9',
		height: '70vh',
		borderRadius: 16
	},
	loginBoxGridOne: {
		height: '100%',
		borderTopLeftRadius: 16,
		borderBottomLeftRadius: 16
	},
	loginBoxGridOneCardMedia: {
		height: '100%',
		borderRadius: 16
	},
	loginBoxGridTwo: {
		height: '100%',
		borderTopRightRadius: 16,
		borderBottomRightRadius: 16,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		margin: '0 auto'
	},
	loginBoxGridTwoCardMedia: {
		height: '95%',
		borderRadius: 16,
		width: '95%',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'space-evenly'
	},
	loginBoxGridTwoCardMediaDiv: {
		display: 'flex',
		marginTop: '10%',
		flexDirection: 'column',
		alignItems: 'center'
	},
	loginBoxGridTwoCardMediaDivCardMedia: {
		backgroundColor: 'white',
		height: '100px',
		borderRadius: ' 10% 30% 50% 70%',
		width: '100px'
	},
	loginBoxGridTwoCardMediaDivTypography: {
		fontFamily: "'Fredoka One', cursive",
		color: 'white',
		fontSize: '2.5rem'
	},
	loginBoxGridTwoCardMediaTypography: {
		fontFamily: "'Open Sans', sans-serif",
		color: 'white',
		fontSize: 19,
		textAlign: 'center',
		width: '75%'
	}
}));
