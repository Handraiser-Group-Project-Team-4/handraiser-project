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

	//CHATS
	io.on('connection', socket => {
		const users = [];
		let messages = [];
		console.log('a user connected');

		socket.on('join', ({ username, room, userObj }, callback) => {
			const user = {
				id: socket.id,
				name: username,
				room: room,
				user_id: userObj.user_id
			};

			// console.log(userObj)
			users.push(user);

			socket.join(`${user.room}`);
			callback();
		});

		socket.on('sendMessage', ({ message }, callback) => {
			const new_date = new Intl.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'short',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			}).format(new Date());

			const user = users.find(user => user.id === socket.id);

			io.to(`${user.room}`).emit('message', {
				text: message,
				user: user.name,
				user_id: user.user_id,
				time_sent: new_date
			});

			callback();
		});

		socket.on('saveChat', currentChat => {
			messages = Object.assign([], currentChat);
		});

		socket.on('disconnect', () => {
			const user = users.find(user => user.id === socket.id);

			if (user.room !== undefined)
				messages.map(conversation => {
					// db.query(`SELECT message from messages`)
					// .then(res => {
					//     if(Object.keys(res).length === 0)
					//         db.query(`INSERT INTO messages (message, concern_id) VALUES('${JSON.stringify(conversation)}', ${user.room}) `)
					// })
					// .catch(err => console.log(err))

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
									)}', ${user.room}) `
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
