import React, { useEffect } from 'react';
import io from 'socket.io-client';

//MATERIAL UI
import MaterialTable from 'material-table';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';

let socket;
const ChatModal = ({
	modal,
	handleModal,
	mentors,
	currentConcern,
	userObj,
	id
}) => {
	smsmodal;
	const ENDPOINT = 'localhost:3001';

	useEffect(() => {
		socket = io(process.env.WEBSOCKET_HOST || ENDPOINT);
	}, [ENDPOINT]);

	const sendConcern = (evt, data) => {
		evt.preventDefault();

		const concern = {
			class_id: id,
			mentor_id: `${data.user_id}`,
			student_id: `${currentConcern.student_id}`,
			concern_title: currentConcern.concern_title,
			concern_status: currentConcern.concern_status
		};
		socket.emit('sendConcern', { concern, userObj }, () => {});
	};

	return (
		<Dialog
			open={modal}
			onClose={handleModal}
			fullWidth={true}
			maxWidth="md"
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">
				{'Request Help to Other Mentor/s'}
			</DialogTitle>
			<DialogContent>
				<MaterialTable
					title=""
					columns={[
						{
							title: 'Name',
							field: 'name',
							render: rowData => (
								<React.Fragment>
									<div style={{ display: `flex` }}>
										<img
											src={rowData.avatar}
											width="50"
											height="50"
											style={{ borderRadius: `50%`, margin: `0 30px 0 0` }}
										/>
										<p>
											{rowData.firstname} {rowData.lastname}
										</p>
									</div>
								</React.Fragment>
							)
						},
						{ title: 'Status', field: 'user_status' }
					]}
					data={mentors}
					options={{
						selection: true
					}}
					actions={[
						{
							tooltip: 'Send a help to selected mentor/s',
							icon: 'send',
							onClick: (evt, data) => sendConcern(evt, ...data)
						}
					]}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default ChatModal;
