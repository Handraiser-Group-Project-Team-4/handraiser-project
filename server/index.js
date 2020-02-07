const massive = require('massive');
const http = require('http');
const express = require('express');
const io = require('socket.io')();
const cors = require('cors');
const auth = require('./controllers/auth');
const router = require('./router');
const users = require('./controllers/users');
const cohorts = require('./controllers/cohorts');
const concern = require('./controllers/concern');
const data = require('./controllers/data');
require('dotenv').config();

massive({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASS
}).then(db => {
	const app = express();
	const server = http.createServer(app);
	// const io = socketio(server);
	io.attach(server);

	app.set('db', db);

	app.use(express.json());
	app.use(cors());
	app.use(router);

	app.get('/api/users', users.login);
	app.use(auth.header);

	// USERS
	app.patch('/api/logout/:id', users.logout);
	app.post('/api/users', users.create);
	app.get('/api/users/:id', users.fetch);
	app.get('/api/pending', users.pending);
	app.get('/api/approved', users.approved);
	app.get('/api/disapproved', users.disapproved);
	app.patch('/api/toapprove/:id', users.movingToApprove);
	app.patch('/api/todisapprove/:id', users.movingToDisapprove);
	app.patch('/api/pending/:id', users.request);

	// COHORTS
	app.post('/api/class', cohorts.make);
	app.get('/api/class', cohorts.lista);
	app.patch('/api/class/:id', cohorts.changeKey);

	app.get('/api/cohorts', cohorts.list);
	app.post('/api/cohorts', cohorts.create);
	app.get('/api/cohort-check/:id', cohorts.checkUser);
	app.post('/api/submit-key/', cohorts.submitKey);

	// CONCERN
	app.get('/api/concern/:id', concern.list);
	app.post('/api/concern/', concern.create);
	app.patch('/api/concern/:id', concern.update);
	app.delete('/api/concern/:id', concern.delete);

	//SOCKETS
	io.on('connection', socket => {
		console.log('a user connected');

		socket.on('join', ({ class_id, user_id }, callback) => {
			const { user } = data.addUser({ id: socket.id, class_id, user_id });
			socket.join(user.class_id);
			callback();
		});

		socket.on('concern', (values, callback) => {
			const user = data.users.find(user => user.id === socket.id);
			io.to(`${user.class_id}`).emit('output', values);
			callback();
		});

		socket.on('chatRoom', (values, callback) => {
			const user = data.users.find(user => user.id === socket.id);
			io.to(`${user.class_id}`).emit('chatRoom', values);
			callback();
		});

		socket.on('joinChat', (values, callback) => {
			const { chat, concern_id, mentor_id, student_id } = values;
			const concern = data.concerns.find(
				concerns => concerns.concern_id === concern_id
			);

			if (!concern) {
				data.concerns.push({
					chat,
					concern_id,
					mentor_id,
					student_id,
					id: socket.id
				});
				socket.join(concern_id);
			}

			callback();
		});

		socket.on('sendMessage', ({ message, concern_id }, callback) => {
			const new_date = new Intl.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'short',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			}).format(new Date());

			const concern = data.concerns.find(
				concerns => concerns.concern_id === concern_id
			);
			io.to(`${concern.concern_id}`).emit('message', {
				text: message,
				concern_id: concern.concern_id,
				student_id: concern.student_id,
				mentor_id: concern.mentor_id,
				time_sent: new_date
			});
			callback();
		});
		socket.on('saveChat', currentChat => {
			data.messages = Object.assign([], currentChat);
		});

		socket.on('disconnect', () => {
			const concern = data.concerns.find(concerns => concerns.id === socket.id);

			data.messages.map(conversation => {
				db.query(
					`SELECT message from messages WHERE message = '${JSON.stringify(
						conversation
					)}'`
				)
					.then(res => {
						if (Object.keys(res).length === 0)
							db.query(
								`INSERT INTO messages (message, concern_id) VALUES('${JSON.stringify(
									conversation
								)}', ${concern.concern_id}) `
							);
					})
					.catch(err => console.log(err));
			});

			console.log('user disconnected');
		});
	});

	const PORT = process.env.PORT || 3001;

	server.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
	});
});
