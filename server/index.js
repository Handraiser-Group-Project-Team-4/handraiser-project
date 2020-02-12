const massive = require("massive");
const http = require("http");
const express = require("express");
const io = require("socket.io")();
const cors = require("cors");
const auth = require("./controllers/auth");
// const router = require("./router");
const users = require("./controllers/users");
const chats = require("./controllers/chat");
const concerns = require("./controllers/concerns");
const cohorts = require("./controllers/cohorts");
const concern = require("./controllers/concern");
require("dotenv").config();

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

    app.set("db", db);

    app.use(express.json());
    app.use(cors());
    // app.use(router);

    app.get("/api/users", users.login);
    app.use(auth.header);

    // USERS
    app.patch("/api/logout/:id", users.logout);
    app.post("/api/users", users.create);
    app.get("/api/users/:id", users.fetch);
    app.get("/api/users/:id/:room", users.chatFetch);

    // COHORTS
    app.get("/api/cohorts/", cohorts.list);
    app.post("/api/cohorts", cohorts.create);
    app.get("/api/cohort-check/:id", cohorts.checkUser);
    app.post("/api/submit-key/", cohorts.submitKey);

    // CONCERN
    app.get("/api/concern/:id", concern.list);
    app.post("/api/concern/", concern.create);
    app.patch("/api/concern/:id", concern.update);
    app.delete("/api/concern/:id", concern.delete);

    // ADMIN - USERS
    app.patch("/api/assigning/:id", users.assign);
    app.patch("/api/pending/:id", users.request);
    app.get("/api/allusers", users.fetchall);
    app.get("/api/user_approval_fetch", users.user_approval_fetch);
    app.patch("/api/toapprove/:id", users.movingToApprove);
    app.patch("/api/todisapprove/:id", users.movingToDisapprove);

    // ADMIN - COHORTS
    app.post("/api/class", cohorts.make);
    app.patch("/api/class/:id", cohorts.changeKey);
    app.patch("/api/toggleCohort/:id", cohorts.toggleCohort);
    app.delete("/api/kickstud/:userId/:classId", cohorts.deleteStud);
    app.get("/api/viewJoinedStudents/:id", cohorts.viewCohort);
    app.delete("/api/deleteClass/:id", cohorts.deleteClass)

    //WEBSOCKETS
    io.on("connection", socket => {
      //CHAT SOCKETS
      chats.chatSockets(socket, io, db);

      // CONCERN SOCKETS
      concerns.concernSockets(socket, io, db);

      // ADMIN SOCKET
      socket.on(`mentorRequest`, ({ data }) => {
        io.emit("fetchMentorRequest");
      });

      socket.on(`handleRoleRequest`, ({ user_id, approval_status }) => {
        // db.users.find(user_id)
        // .then(user => {
        io.emit("notifyUser", { user_id, approval_status });
        // })
      });

      socket.on(`renderCohort`, ({ data }) => {
        console.log(data)
        io.emit("fetchCohort", data);
      });

      socket.on(`changeUserRole`, ({ user_id, user_role_id }) => {
        // db.users.find(user_id)
        // .then(user => {
        // console.log(user)
        if (user_role_id === 2) io.emit("studentToMentor", user_id);
        else if (user_role_id === 3) io.emit("mentorToStudent", user_id);
        // })
      });
    });

    const PORT = process.env.PORT || 3001;

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => console.log(err));