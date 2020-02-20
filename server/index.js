const massive = require("massive");
const http = require("http");
const express = require("express");
const io = require("socket.io")();
const cors = require("cors");

require("dotenv").config();

//ENDPOINTS
const auth = require("./controllers/auth");
const users = require("./controllers/users");
const cohorts = require("./controllers/cohorts");

//SOCKETS
const admin = require("./controllers/sockets/admin");
const chats = require("./controllers/sockets/chat");
const concerns = require("./controllers/sockets/concerns");

massive({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
})
	.then(db => {
		const app = express();
		const server = http.createServer(app);
		io.attach(server);

		app.set('db', db);

		app.use(express.json());
		app.use(cors());

		app.get('/api/users', users.login);
		app.patch('/api/logout/:id', users.logout);
		app.use(auth.header);

		// USERS
		app.post('/api/users', users.create);
		app.get('/api/users/:id', users.fetch);
		app.get('/api/users/:id/:room', users.chatFetch);
		app.patch('/api/darkmode/:id', users.darkmode);

		// COHORTS
		app.get('/api/cohorts/', cohorts.list);
		app.post('/api/cohorts', cohorts.create);
		app.get('/api/cohort-check/:id', cohorts.checkUser);
		app.post('/api/submit-key/', cohorts.submitKey);
		app.get('/api/class-details/:id', cohorts.classDetails);
		// app.get('/api/cohortMentors/:id', cohorts.getCohortMentors)

		// ADMIN - USERS
		app.patch("/api/assigning/:id", users.assign);
		app.patch("/api/pending/:id", users.request);
		app.get("/api/allusers", users.fetchall);
		app.get("/api/mentors/:id", users.getMentors);
		app.get("/api/user_approval_fetch", users.user_approval_fetch);
		app.patch("/api/toapprove/:id", users.movingToApprove);
		app.patch("/api/todisapprove/:id", users.movingToDisapprove);
		app.get("/api/getAttendingCohorts/:id", users.getAttendingCohorts);

		// ADMIN - COHORTS
		app.post("/api/class", cohorts.make);
		app.patch("/api/class/:id", cohorts.changeKey);
		app.patch("/api/toggleCohort/:id", cohorts.toggleCohort);
		app.delete("/api/kickstud/:userId/:classId", cohorts.deleteStud);
		app.get("/api/viewJoinedStudents/:id", cohorts.viewCohort);
		app.delete("/api/deleteClass/:id", cohorts.deleteClass)
    // app.post("/api/assignMentor", cohorts.assignMentor)
    app.post("/api/enroll", cohorts.enroll);
    app.patch("/api/updateTitleDesc/:id", cohorts.updateTitleDesc);
    app.get("/api/getMentors/:id", cohorts.getMentors);


		//WEBSOCKETS
		io.on('connection', socket => {
			//CHAT SOCKETS
			chats.chatSockets(socket, io, db);

			// CONCERN SOCKETS
			concerns.concernSockets(socket, io, db);

			// ADMIN SOCKET
			admin.adminSockets(socket, io, db);
		});

		const PORT = process.env.PORT || 3001;

		server.listen(PORT, () => {
			console.log(`Server listening on port ${PORT}`);
		});
	})
	.catch(err => console.log(err));
