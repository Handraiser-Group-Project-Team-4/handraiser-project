// module.exports = {
//     conversation: (socket) => {


//         const users = []
//         var messages=[];

//         console.log("a user connected");

//         socket.on("join", ({username, room}, callback) => {
//             const user = {
//                 id: socket.id, 
//                 name: username,
//                 room: room,
//             };

//             // console.log(user)
//             users.push(user);

//             if (user.room)
//                 db.query(`SELECT * FROM messages WHERE concern_id=${user.room}`)
//                 .then(res => {
//                     // console.log(res)
//                     res.map(x =>{ 
//                         messages.push(x.message)
//                     })
//                     console.log(user)
//                 })
//                 .catch(err => console.log(err))

//             // console.log(user)
//             socket.emit("message", {
//                 user: "admin",
//                 text: `${user.name}, welcome to room ${user.room}.`
//             });
            

//             socket.join(`${user.room}`);
//             callback();    
//         });

//         socket.on("sendMessage", (message, callback) => {
//             const new_date = new Intl.DateTimeFormat("en-US", {
//                 year: "numeric",
//                 month: "short",
//                 day: "2-digit",
//                 hour: "2-digit",
//                 minute: "2-digit"
//             }).format(new Date());
    
//             const user = users.find(user => user.id === socket.id);

//             io.to(`${user.room}`).emit("message", { 
//                 user: user.name, 
//                 text: message,  
//                 time_sent: new_date 
//             });

//             callback();
//         });

//         socket.on("disconnect", () => {
//             console.log("user disconnected");
//         });
//     }
// }