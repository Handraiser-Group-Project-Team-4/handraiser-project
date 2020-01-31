const massive = require("massive");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");

const router = require("./router");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require("./controllers/chat");
const users = require("./controllers/users");
const cohorts = require("./controllers/cohorts");

massive({
  host: "localhost",
  port: 5435,
  database: "handraiser",
  user: "postgres",
  password: "handraiser"
}).then(db => {
  const app = express();
  const server = http.createServer(app);
  const io = socketio(server);

  app.set("db", db);
  app.use(express.json());
  app.use(cors());
  app.use(router);

  const PORT = process.env.PORT || 4000;

  // USERS
  app.get("/api/users", users.login);
  app.post("/api/users", users.create);
  app.get("/api/users/:id", users.fetch);

  // COHORTS
  app.get("/api/cohorts", cohorts.list);
  app.get("/api/cohort-check/:id", cohorts.checkUser);
  app.post("/api/submit-key/", cohorts.submitKey);

  //CHATS
  io.on("connection", socket => {
    const users = [];
    const new_date = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date());

    console.log("a user connected");

    socket.on("join", ({ name, room }, callback) => {
      const user = { id: socket.id, name, room };
      users.push(user);

      socket.broadcast.to(user.room).emit("message", {
        user: "admin",
        text: `hello`,
        time_sent: new_date
      });
      socket.join(user.room);

      callback();
    });

    socket.on("sendMessage", (message, callback) => {
      const user = users.find(user => user.id === socket.id);

      io.to(user.room).emit("message", {
        user: user.name,
        text: message,
        time_sent: new_date
      });

      callback();
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
