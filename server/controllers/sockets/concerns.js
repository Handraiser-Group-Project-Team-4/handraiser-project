module.exports = {
	concernSockets: (socket, io, db) => {
		socket.on('joinConcern', ({ id }, callback) => {
			db.concern.find({ class_id: id }).then(res =>
				io.to(`${id}`).emit('concernData', {
					concern: res,
					alert: undefined
				})
			);
			db.query(
				`SELECT * FROM classroom_logs WHERE class_id  = ${id} ORDER BY classroom_logs_id DESC`
			).then(res => {
				io.to(`${id}`).emit('fetchOldLogs', {
					data: res
				});
			});

			socket.join(`${id}`);
			callback();
		});
		socket.on('getChatroom', ({ id }, callback) => {
			db.concern
				.find({
					class_id: id,
					concern_status: 'onprocess'
				})
				.then(data => {
					io.to(`${id}`).emit('chatroomData', { data });
				});

			callback();
		});

		socket.on('sendConcern', ({ concern, userObj }, callback) => {
			db.concern.insert(concern).then(() =>
				db.concern.find({ class_id: concern.class_id }).then(res =>
					io.to(`${concern.class_id}`).emit('concernData', {
						concern: res,
						alert: {
							variant: 'success',
							name: userObj.name,
							action: 'requested for help'
						}
					})
				)
			);
			logs(
				db,
				io,
				concern.class_id,
				userObj.user_id,
				`${userObj.name} requested for help`
			);

			callback();
		});

		socket.on(
			'updateConcern',
			({ id, concern_id, updateData, userObj }, callback) => {
				const { concern_status, mentor_id } = updateData;
				db.concern.update(concern_id, { concern_status, mentor_id }).then(() =>
					db.concern.find({ class_id: id }).then(res =>
						io.to(`${id}`).emit('concernData', {
							concern: res,
							alert: {
								variant:
									concern_status === 'onprocess'
										? 'info'
										: concern_status === 'done'
										? 'success'
										: 'warning',
								name: userObj.name,
								action:
									concern_status === 'onprocess'
										? 'accepts request'
										: concern_status === 'done'
										? 'finished a request'
										: 'updates request back to queue'
							}
						})
					)
				);
				logs(
					db,
					io,
					id,
					userObj.user_id,
					concern_status === 'done'
						? `${userObj.name} finished a request`
						: concern_status === 'onprocess'
						? `${userObj.name} accepts a request`
						: `${userObj.name} updates request back to queue`
				);

				callback();
			}
		);

		socket.on('deleteConcern', ({ id, concern_id, userObj }, callback) => {
			db.messages.destroy({ concern_id }).then(() => {
				db.concern.destroy(concern_id).then(() =>
					db.concern
						.find({ class_id: id })
						.then(res =>
							io.to(`${id}`).emit('concernData', {
								concern: res,
								alert: {
									variant: 'error',
									name: userObj.name,
									action: 'removes request'
								}
							})
						)
						.catch()
				);
			});
			logs(db, io, id, userObj.user_id, `${userObj.name} removes a concern`);
			callback();
		});

		socket.on(
			'updateConcernText',
			({ id, concern_id, text, userObj }, callback) => {
				db.concern.update(concern_id, { concern_title: text }).then(() =>
					db.concern.find({ class_id: id }).then(res =>
						io.to(`${id}`).emit('concernData', {
							concern: res,
							alert: {
								variant: 'warning',
								name: userObj.name,
								action: 'edit the concern'
							}
						})
					)
				);
				logs(db, io, id, userObj.user_id, `${userObj.name} edit a concern`);
				callback(text);
			}
		);

		socket.on('disconnectConcern', () => {
			console.log('user disconnected to concern');
		});
	}
};

const date = () => {
	var new_date = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	}).format(new Date());
	return new_date;
};

const logs = (db, io, id, user_id, action) => {
	db.classroom_logs
		.insert({
			class_id: id,
			user_id: user_id,
			action_made: action,
			date_time: `${date()}`
		})
		.then(res =>
			io.to(`${id}`).emit('newLog', {
				log: res
			})
		);
};
