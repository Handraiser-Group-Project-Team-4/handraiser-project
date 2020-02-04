const massive = require("massive");
const http = require("http");
const express = require("express");
const io = require("socket.io")();
const cors = require("cors");
const auth = require("./controllers/auth");
const router = require("./router");
const users = require("./controllers/users");
const cohorts = require("./controllers/cohorts");
require("dotenv").config();
massive({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
}).then(db => {
<<<<<<< HEAD
  const app = express();
  const server = http.createServer(app);
  const io = socketio(server);
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
  // COHORTS
  app.get("/api/cohorts", cohorts.list);
  app.post("/api/cohorts", cohorts.create);
  app.get("/api/cohort-check/:id", cohorts.checkUser);
  app.post("/api/submit-key/", cohorts.submitKey);
  //CHATS
  io.on("connection", socket => {
    const users = [];
    let messages = [];
    console.log("a user connected");

    // socket.on("oldChat", (messages, callback) => {

    // });

    socket.on("join", ({ username, room }, callback) => {
      const user = {
        id: socket.id,
        name: username,
        room: room
      };
      // console.log(user)
      users.push(user);
      users.map(x => {
        socket.emit("message", {
          user: "admin",
          text: `${user.name}, welcome to room ${user.room}.`
=======
    const app = express();
    const server = http.createServer(app);
    // const io = socketio(server);
    io.attach(server)

    app.set("db", db);

    app.use(express.json());
    app.use(cors());
    app.use(router);

    app.get("/api/users", users.login);
    app.use(auth.header)
  
    // USERS
    app.patch('/api/logout/:id', users.logout)
    app.post('/api/users', users.create)
    app.get('/api/users/:id', users.fetch)
    app.get('/api/pending', users.pending)
    app.get('/api/approved', users.approved)
    app.get('/api/disapproved', users.disapproved)
    app.patch('/api/toapprove/:id', users.movingToApprove)
    app.patch('/api/todisapprove/:id', users.movingToDisapprove)
  
    // COHORTS
    app.post('/api/class', cohorts.make)
    app.get('/api/class', cohorts.lista)
    app.patch('/api/class/:id', cohorts.changeKey)
  
  
    
    app.get('/api/cohorts', cohorts.list)
    app.post('/api/cohorts', cohorts.create)
    app.get('/api/cohort-check/:id', cohorts.checkUser)
    app.post('/api/submit-key/', cohorts.submitKey)

    //CHATS
    io.on("connection", socket => {
        const users = [];
        let messages=[];
        console.log("a user connected");

        socket.on("join", ({username, room, userObj}, callback) => {
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

        socket.on("sendMessage", ({message}, callback) => {
            const new_date = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }).format(new Date());

            const user = users.find(user => user.id === socket.id);

            io.to(`${user.room}`).emit("message", { 
                text: message,
                user: user.name, 
                user_id: user.user_id,               
                time_sent: new_date,
            });

            callback();
        });

        socket.on("saveChat", (currentChat) => {
            messages = Object.assign([], currentChat)
        });

        socket.on("disconnect", () => {
            const user = users.find(user => user.id === socket.id);

            if(user.room !== undefined)
                messages.map(conversation => {
                    // db.query(`SELECT message from messages`)
                    // .then(res => {
                    //     if(Object.keys(res).length === 0)
                    //         db.query(`INSERT INTO messages (message, concern_id) VALUES('${JSON.stringify(conversation)}', ${user.room}) `)
                    // })
                    // .catch(err => console.log(err))   


                    db.query(`SELECT message from messages WHERE message = '${JSON.stringify(conversation)}'`)
                    .then(res => {
                        if(Object.keys(res).length === 0)
                            db.query(`INSERT INTO messages (message, concern_id) VALUES('${JSON.stringify(conversation)}', ${user.room}) `)
                    })
                    .catch(err => console.log(err))            
                })
               
            console.log("user disconnected");
>>>>>>> d9ec2994bab0e0ec2c74aba939cde8ed08b08e51
        });
      });

      if (user.room)
        db.query(`SELECT * FROM messages WHERE concern_id=${user.room}`)
          .then(res => {
            console.log(res);
            res.map(x => messages.push(x));
            console.log(messages);
          })
          .catch(err => console.log(err));

      // var num = 0;
      // while (num < 5) {
      //   socket.emit("message", {
      //     user: "admin",
      //     text: `${user.name}, welcome to room ${user.room}.`
      //   });
      //   num = num + 1;
      // }
      // socket.broadcast.to(`${user.room}`).emit("message", {
      //   user: "This is chat",
      //   text: `from db`,
      //   time_sent: `Jan 31, 2020, 01:55 PM`
      // });
      socket.join(`${user.room}`);
      callback();
    });
    socket.on("sendMessage", (message, callback) => {
      const new_date = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date());
      const user = users.find(user => user.id === socket.id);
      io.to(`${user.room}`).emit("message", {
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
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
