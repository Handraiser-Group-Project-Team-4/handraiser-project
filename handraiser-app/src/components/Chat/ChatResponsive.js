import React from 'react';
import ChatIcon from '@material-ui/icons/Chat';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';
import Chat from './Chat';

export default function ChatResponsive() {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	return (
		<div>
			<Fab color="primary" aria-label="add" className={classes.fab}>
				<ChatIcon onClick={() => setOpen(true)} />
			</Fab>
			<Dialog
				fullScreen
				open={open}
				onClose={() => setOpen(false)}
				TransitionComponent={Transition}
			>
				<AppBar className={classes.appBar}>
					<Toolbar>
						<IconButton
							edge="start"
							color="inherit"
							onClick={() => setOpen(false)}
							aria-label="close"
						>
							<CloseIcon />
						</IconButton>
						<Typography variant="h6" className={classes.title}>
							Chat
						</Typography>
					</Toolbar>
				</AppBar>
				<Chat modal={true} />
			</Dialog>
		</div>
	);
}
const useStyles = makeStyles(theme => ({
	appBar: {
		position: 'relative'
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	fab: {
		// backgroundColor: '#333',
		right: 20,
		bottom: 50,
		position: 'fixed'
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
