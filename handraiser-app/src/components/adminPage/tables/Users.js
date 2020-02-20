import React, { useState, useEffect } from 'react';
import axios from 'axios';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import MaterialTable from 'material-table';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import { useTheme } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

// Components
import Attending from '../CohortTools/Attending';
import Badger from '../../tools/Badger';
import PopupModal from '../../tools/PopupModal';

// Icons
import VisibilityIcon from '@material-ui/icons/Visibility';
import WorkIcon from '@material-ui/icons/Work';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export default function StickyHeadTable() {
	const [users, setUsers] = useState({
		columns: [
			{
				title: 'Avatar',
				field: 'firstname',
				render: rowData => (
					<div style={{ display: `flex` }}>
						<img
							src={rowData.avatar}
							alt={rowData.avatar}
							width="50"
							height="50"
							style={{ borderRadius: `50%`, margin: `0 30px 0 0` }}
						/>
						<p>
							{rowData.firstname} {rowData.lastname}
						</p>
					</div>
				)
			},
			{
				title: 'Role',
				field: 'user_role_id',
				headerStyle: { display: `none` },
				cellStyle: { display: `none` },
				lookup: { 3: 'Student', 2: 'Mentor' }
			},
			{
				title: 'Role',
				field: 'user_role_id',
				render: rowData =>
					rowData.user_role_id === 3 ? (
						<Chip
							variant="outlined"
							label="Student"
							color="primary"
							avatar={<Avatar>S</Avatar>}
						/>
					) : (
						<Chip
							variant="outlined"
							label="Mentor"
							color="secondary"
							avatar={<Avatar>M</Avatar>}
						/>
					),
				export: false
			},
			{ title: 'Email', field: 'email' },
			{
				title: 'Status',
				field: 'user_status',
				render: rowData =>
					rowData.user_status ? (
						<status-indicator active pulse positive />
					) : (
						<status-indicator active pulse negative />
					),
				export: false
			},
			{
				title: 'Actions',
				headerStyle: {
					// border: "none",
					textAlign: 'center'
				},
				render: rowData => (
					<div
						style={{
							// backgroundColor: "red",
							display: `flex`,
							alignItems: `center`,
							justifyContent: `space-evenly`
							// marginRight: 50
						}}
					>
						<>
							{rowData.user_role_id === 2 ? (
								<Tooltip title="Assign as Student">
									<WorkIcon onClick={e => openAssignModal(rowData, 3)} />
								</Tooltip>
							) : (
								<Tooltip title="Assign as Mentor">
									<WorkOutlineIcon onClick={e => openAssignModal(rowData, 2)} />
								</Tooltip>
							)}
						</>

						<Tooltip
							title="View Enrolled Cohorts"
							style={{ margin: `0 0 0 5px` }}
						>
							<VisibilityIcon
								onClick={e => setAttending({ open: true, data: rowData })}
							/>
						</Tooltip>
					</div>
				)
			}
		],
		mobileColumns: [
			{
				title: 'Avatar',
				field: 'firstname',
				render: rowData => (
					<div style={{ display: `flex` }}>
						<Badger obj={rowData} />
						<div>
							<p style={{ margin: 0 }}>
								{rowData.firstname} {rowData.lastname}
							</p>
							<div style={{ margin: 0, fontSize: 10 }}>
								<span>{rowData.email}</span>
								<br />
								{rowData.user_role_id === 3 ? (
									<span style={{ fontSize: 10, color: 'blue' }}>Student</span>
								) : (
									<span style={{ fontSize: 10, color: 'red' }}>Mentor</span>
								)}
							</div>
						</div>
					</div>
				)
			},
			{
				field: 'class_key',
				width: 50,
				cellStyle: { textAlign: 'right' },
				headerStyle: { textAlign: 'right' },
				render: rowData => (
					<PopupState variant="popover" popupId="demo-popup-menu">
						{popupState => (
							<React.Fragment>
								<MoreVertIcon {...bindTrigger(popupState)} />

								<Menu {...bindMenu(popupState)}>
									{rowData.user_role_id === 2 ? (
										<MenuItem onClick={e => openAssignModal(rowData, 3)}>
											Assign as Student
										</MenuItem>
									) : (
										<MenuItem onClick={e => openAssignModal(rowData, 2)}>
											Assign as Mentor
										</MenuItem>
									)}

									<MenuItem
										onClick={e => setAttending({ open: true, data: rowData })}
									>
										View Enrolled Cohorts
									</MenuItem>
								</Menu>
							</React.Fragment>
						)}
					</PopupState>
				)
			}
		],

		data: []
	});
	const [assignModal, setAssignModal] = useState(false);
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.up('sm'));
	const [assignObj, setAssignObj] = useState({});
	const [cohorts, setCohorts] = useState('');
	const [attending, setAttending] = useState({
		open: false,
		data: ''
	});

	const openAssignModal = (row, role) => {
		setAssignObj({
			user_id: row.user_id,
			firstname: row.firstname,
			lastname: row.lastname,
			avatar: row.avatar,
			role: role
		});
		getCohorts(row);
	};

	const getCohorts = row => {
		axios({
			method: 'get',
			url: `/api/getAttendingCohorts/'${row.user_id}'`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(data => {
				setCohorts(data.data);
			})
			.then(() => {
				setAssignModal(true);
			})

			.catch(err => console.log(err));
	};

	useEffect(() => {
		renderUsers();
	}, []);

	// GET THE Users VALUES
	const renderUsers = () => {
		axios({
			method: 'get',
			url: `/api/allusers`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(data => {
				setUsers({ ...users, data: data.data });
			})
			.catch(err => console.log('err'));
	};

	const closeAttending = () => {
		setAttending({
			...attending,
			open: false
		});
	};

	return (
		<>
			{assignModal && (
				<PopupModal
					title={
						cohorts.length === 0
							? `Assign ${assignObj.firstname} ${assignObj.lastname} as a ${
									assignObj.role === 3 ? 'student' : 'mentor'
							  }?`
							: `${assignObj.firstname} ${assignObj.lastname} will be a ${
									assignObj.role === 3 ? 'student' : 'mentor'
							  } to the following cohort:`
					}
					data={assignObj}
					open={assignModal}
					render={renderUsers}
					cohorts={cohorts}
					handleClose={() => setAssignModal(false)}
					type={'users'}
					getCohorts={() => getCohorts(assignObj)}
				/>
			)}

			{attending.open && (
				<Attending
					open={attending.open}
					handleClose={closeAttending}
					data={attending.data}
				/>
			)}

			<MaterialTable
				title={matches ? 'Users' : null}
				columns={matches ? users.columns : users.mobileColumns}
				data={users.data}
				options={{
					pageSize: 10,
					actionsColumnIndex: -1,
					exportButton: matches,
					headerStyle: { textTransform: `uppercase`, fontWeight: `bold` }
				}}
			/>
		</>
	);
}
