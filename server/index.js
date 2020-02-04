const express = require('express');
const massive = require('massive');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const auth = require('./controllers/auth');
const users = require('./controllers/users');
const cohorts = require('./controllers/cohorts');
const concern = require('./controllers/concern');

massive({
	host: 'localhost',
	port: 5435,
	database: 'handraiser',
	user: 'postgres',
	password: 'handraiser'
}).then(db => {
	const app = express();
	const server = http.createServer(app);
	const io = socketio(server);

	app.set('db', db);

	app.use(express.json());
	app.use(cors());

	app.get('/api/users', users.login);

	app.use(auth.header);

	// USERS
	app.patch('/api/logout/:id', users.logout);
	app.post('/api/users', users.create);
	app.get('/api/users/:id', users.fetch);

	// COHORTS
	app.get('/api/cohorts', cohorts.list);
	app.post('/api/cohorts', cohorts.create);
	app.get('/api/cohort-check/:id', cohorts.checkUser);
	app.post('/api/submit-key/', cohorts.submitKey);

	// CONCERN
	app.get('/api/concern/:id', concern.list);
	app.post('/api/concern/', concern.create);
	app.patch('/api/concern/:id', concern.update);
	app.delete('/api/concern/:id', concern.delete);

	const PORT = 3001;

	server.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
	});

	io.on('connection', function(socket) {
		console.log('User connected ');

		socket.on('join', (id, data) => {
			console.log(id);
			socket.to(id).emit('out', data);
			socket.join(id);
		});

		socket.on('disconnect', function() {
			console.log('User disconnected ');
		});
	});
});
