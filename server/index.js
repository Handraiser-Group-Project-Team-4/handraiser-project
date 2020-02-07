const massive = require("massive");
const http = require("http");
const express = require("express");
const io = require("socket.io")();
const cors = require("cors");
const auth = require("./controllers/auth");
const router = require("./router");
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
}).then(db => {
  const app = express();
  const server = http.createServer(app);
  io.attach(server);

  app.set("db", db);

  app.use(express.json());
  app.use(cors());
  app.use(router);

  app.get("/api/users", users.login);
  app.use(auth.header);

  // USERS
  app.patch("/api/logout/:id", users.logout);
  app.post("/api/users", users.create);
  app.get("/api/users/:id", users.fetch);
  app.get("/api/users/:id/:room", users.chatFetch);
  app.get("/api/pending", users.pending);
  app.get("/api/approved", users.approved);
  app.get("/api/disapproved", users.disapproved);
  app.patch("/api/toapprove/:id", users.movingToApprove);
  app.patch("/api/todisapprove/:id", users.movingToDisapprove);
  app.patch("/api/pending/:id", users.request);

  // COHORTS
  app.post("/api/class", cohorts.make);
  app.get("/api/class", cohorts.lista);
  app.patch("/api/class/:id", cohorts.changeKey);

  app.get("/api/cohorts", cohorts.list);
  app.post("/api/cohorts", cohorts.create);
  app.get("/api/cohort-check/:id", cohorts.checkUser);
  app.post("/api/submit-key/", cohorts.submitKey);

  // CONCERN
  app.get("/api/concern/:id", concern.list);
  app.post("/api/concern/", concern.create);
  app.patch("/api/concern/:id", concern.update);
  app.delete("/api/concern/:id", concern.delete);

  //WEBSOCKETS
  io.on("connection", socket => {
    //CHAT SOCKETS
    chats.chatSockets(socket, io, db);

    // CONCERN SOCKETS
    concerns.concernSockets(socket, io, db);

    //ADMIN SOCKETS
  });

  const PORT = process.env.PORT || 3001;

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
