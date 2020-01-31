const massive = require("massive");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const auth = require('./controllers/auth')
const router = require("./router");
const users = require("./controllers/users");
const cohorts = require("./controllers/cohorts");
require('dotenv').config();

massive({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
}).then(db => {
    const app = express();
    const server = http.createServer(app);
    const io = socketio(server);

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

    // COHORTS
    app.get('/api/cohorts', cohorts.list)
    app.post('/api/cohorts', cohorts.create)
    app.get('/api/cohort-check/:id', cohorts.checkUser)
    app.post('/api/submit-key/', cohorts.submitKey)

    //CHATS
    io.on("connection", socket => {
        const users = []
        let messages=[];

        console.log("a user connected");

        socket.on("join", ({username, room}, callback) => {
            const user = {
                id: socket.id, 
                name: username,
                room: room
            };

            // console.log(user)
            users.push(user);

            if (user.room)
                db.query(`SELECT * FROM messages WHERE concern_id=${user.room}`)
                .then(res => {
                    console.log(res)
                    messages = res 
                })
                .catch(err => console.log(err))

            socket.broadcast
            .to(`${user.room}`)
            .emit("message", { 
                user: "This is chat", 
                text: `from db`, 
                time_sent: `Jan 31, 2020, 01:55 PM` 
            });

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