import React, {useEffect} from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { SnackbarProvider, useSnackbar } from 'notistack';

// Material UI
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Material UI Icons
import AddCircleIcon from '@material-ui/icons/AddCircle';

let socket;
export default function PopupModal({ handleClose, open, data, title, userId, name }) {
	const ENDPOINT = 'localhost:3001';
	const { enqueueSnackbar } = useSnackbar();
	const columns = [
		{ title: 'Title', field: 'class_title' },
		{ title: 'Email', field: 'class_description' },
		{
			title: 'Status',
			field: 'class_status',
			lookup: {
				true: (
					<span
						style={{
							background: `green`,
							color: `white`,
							padding: `2px 4px`,
							borderRadius: `3px`
						}}
					>
						active
					</span>
				),
				false: (
					<span
						style={{
							background: `red`,
							color: `white`,
							padding: `2px 4px`,
							borderRadius: `3px`
						}}
					>
						close
					</span>
				)
			}
		},
		{ title: 'Status', field: 'class_created' }
	];
	
	const toastNotify = (message, variant) => {
		// variant could be success, error, warning, info, or default
		enqueueSnackbar(message, { variant });
	};

	useEffect(() => {
        socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
	  }, [ENDPOINT]);
	  
	const assign = (data, id) => {
		let date = new Date();
		let newDate = date.toLocaleString();

		data.map(x => {
			return axios({
				method: 'post',
				url: `/api/enroll/`,
				headers: {
					Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
				},
				data: {
					class_id: x.class_id,
					user_id: id,
					date_joined: newDate
				}
			})
				.then(() => {
					socket.emit('userAssignedMentor', {user_id: id, class_id: x.class_id})
					socket.emit('renderCohort')
					handleClose();
				})
				.catch(err => console.log('err'));
		});

		toastNotify(`Successfully added a cohort to ${title}`, 'success')
	};

	return (
		<SnackbarProvider maxSnack={3}>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullwidth="true"
				maxWidth="lg"
			>
				<DialogTitle id="alert-dialog-title">
					<div
						style={{
							display: `flex`,
							alignItems: `center`,
							flexDirection: `column`,
							fontWeight: `normal`
						}}
					>
						<h4>Assign Cohort to {title}</h4>
					</div>
				</DialogTitle>

				<DialogContent>
					<MaterialTable
						title="Cohorts"
						columns={columns}
						data={data}
						options={{
							selection: true,
							pageSize: 10,
							headerStyle: { textTransform: `uppercase`, fontWeight: `bold` }
						}}
						actions={[
							{
								tooltip: 'Assign as Cohort',
								icon: () => <AddCircleIcon />,
								onClick: (e, data) => assign(data, userId)
							}
						]}
					/>
				</DialogContent>

				<DialogActions></DialogActions>
			</Dialog>
		</SnackbarProvider>
	);
}
