import React from 'react';
import styled from 'styled-components';

// COMPONENTS
import IMG_4049 from '../../images/TeamMembers/IMG_4049.JPG';
import DSC_0966 from '../../images/TeamMembers/DSC_0966.jpg';
import DSC_0984 from '../../images/TeamMembers/DSC_0984.jpg';
import DSC_0958 from '../../images/TeamMembers/DSC_0958.jpg';
import DSC_0997 from '../../images/TeamMembers/DSC_0997.jpg';
import DSC_0952 from '../../images/TeamMembers/DSC_0952.jpg';
import MainpageTemplate from '../tools/MainpageTemplate';
import { DarkModeContext } from '../../App';

// MATERIAL-UI
import {
	makeStyles,
	IconButton,
	Typography,
	Box,
	Grid
} from '@material-ui/core/';

// ICONS
import FacebookIcon from '@material-ui/icons/Facebook';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

export default function Team() {
	const { darkMode } = React.useContext(DarkModeContext);
	const classes = useStyles(darkMode);
	const data = [
		{
			name: 'Clark Amor',
			img: DSC_0952
		},
		{
			name: 'Jake Balbedina',
			img: DSC_0997
		},
		{
			name: 'Joven Bandagosa',
			img: DSC_0984
		},
		{
			name: 'Zion Camba',
			img: DSC_0966
		},
		{
			name: 'Vince Gerard Ludovice',
			img: IMG_4049
		},
		{
			name: 'Noe Philip Restum',
			img: DSC_0958
		}
	];

	return (
		<MainpageTemplate tabIndex={1}>
			<Content>
				<Typography className={classes.sectionTitle}>Meet The Team</Typography>
				<Grid container spacing={3} className={classes.gridContainer}>
					{data.map((item, ind) => (
						<Grid item xs={12} sm={6} md={6} lg={4} key={ind}>
							<Box className={classes.gridContainerBox}>
								<Box className={classes.gridContainerBoxBox}>
									<img src={item.img} alt="" />
									<Typography
										component="div"
										style={{ color: darkMode ? '#fff' : '#000' }}
									>
										{item.name}
									</Typography>
									<div>
										<IconButton>
											<FacebookIcon />
										</IconButton>
										<IconButton>
											<LinkedInIcon />
										</IconButton>
									</div>
								</Box>
							</Box>
						</Grid>
					))}
				</Grid>
			</Content>
		</MainpageTemplate>
	);
}
const Content = styled.div`
	width: calc(100vw - 240px);
	height: calc(100vh - 100px);
	margin: 70px auto 0;
	-webkit-transform-origin: top center;
	transform-origin: top center;
	-webkit-transform: scale(0.8);
	transform: scale(0.8);
`;

const useStyles = makeStyles(theme => ({
	gridContainer: {
		marginBottom: 30,
		'& > div': {
			padding: '0!important'
		}
	},
	sectionTitle: darkMode => ({
		margin: '0 0 70px',
		color: darkMode ? '#fff' : '#000',
		fontFamily: '"Roboto", sans-serif',
		fontSize: '3.5rem',
		fontWeight: '300',
		lineHeight: '2.625rem',
		textAlign: 'center'
	}),
	gridContainerBox: darkMode => ({
		// zIndex: "0",
		// position: "relative",
		background: darkMode ? '#424242' : '#fff',
		boxShadow: darkMode ? '0 0 0 1px #333' : '0 0 0 1px #e2e9ed',
		padding: '40px 30px',
		// boxSizing: "border-box",
		'-webkit-transition':
			'box-shadow 0.2s ease, z-index 0s 0.2s ease, -webkit-transform 0.2s ease',
		transition:
			'box-shadow 0.2s ease, z-index 0s 0.2s ease, -webkit-transform 0.2s ease',
		transition:
			'box-shadow 0.2s ease, transform 0.2s ease, z-index 0s 0.2s ease',
		transition:
			'box-shadow 0.2s ease, transform 0.2s ease, z-index 0s 0.2s ease, -webkit-transform 0.2s ease',
		'&:before': {
			content: "''",
			display: 'block'
			// paddingTop: "80%"
		},
		'&:hover': {
			zIndex: '1',
			boxShadow: '0 8px 50px rgba(0, 0, 0, 0.2)',
			'-webkit-transform': 'scale(1.05)',
			transform: 'scale(1.05)',
			'-webkit-transition':
				'box-shadow 0.2s ease, z-index 0s 0s ease, -webkit-transform 0.2s ease',
			transition:
				'box-shadow 0.2s ease, z-index 0s 0s ease, -webkit-transform 0.2s ease',
			transition:
				'box-shadow 0.2s ease, transform 0.2s ease, z-index 0s 0s ease',
			transition:
				'box-shadow 0.2s ease, transform 0.2s ease, z-index 0s 0s ease, -webkit-transform 0.2s ease'
		}
	}),
	gridContainerBoxBox: {
		// position: "absolute",
		// top: "50%",
		// left: "0",
		width: '100%',
		// "-webkit-transform": "translate(0, -50%)",
		// transform: "translate(0, -50%)",
		// textAlign: "center",
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		'& > img': {
			width: 150,
			height: 150,
			borderRadius: '100%',
			margin: '10px auto 20px',
			overflow: 'hidden',
			display: 'block'
		},
		'&>div': {
			color: '#313435',
			fontFamily: '"Roboto", sans-serif',
			fontSize: '1.5rem',
			fontWeight: '500',
			lineHeight: '2.625rem'
		}
	}
}));
