module.exports = {
  chatSockets: (socket, io, db) => {
    const users = [];
    socket.on("join", ({ username, chatroom, userObj }, callback) => {
      console.log("a user connected to chat");
      const user = {
        id: socket.id,
        name: username,
        room: chatroom,
        user_id: userObj.user_id,
        avatar: userObj.avatar
      };
      users.push(user);
      let chatUsers = {};
      db.query(
        `SELECT * FROM users, concern WHERE users.user_id = '${user.user_id}' AND concern.concern_id = ${user.room}`
      ).then(concern => {
        chatUsers.concern = concern[0];
        if (concern.length > 0)
          db.query(
            `SELECT message FROM messages WHERE concern_id = ${concern[0].concern_id} ORDER BY message_id ASC`
          ).then(messages => {
            let temp = [];
            messages.map(x => {
              temp.push(x.message);
            });
            chatUsers.messages = temp;
            io.to(`${user.room}`).emit("oldChat", {
              data: chatUsers
            });
          });
      });
      socket.join(`${user.room}`);
      callback();
    });

    socket.on("typing", ({ name }) => {
      const user = users.find(user => user.id === socket.id);

      socket.to(user.room).emit("displayTyping", { name });
    });

    socket.on("NotTyping", ({ name }) => {
      const user = users.find(user => user.id === socket.id);

      socket.to(user.room).emit("displayNotTyping", { name });
    });

    socket.on("sendMessage", ({ message }, callback) => {
      const new_date = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }).format(new Date());
      const user = users.find(user => user.id === socket.id);
      socket.to(user.room).emit("displayNotTyping", { name: user.name });
      db.messages
        .insert({
          concern_id: user.room,
          message: {
            text: message,
            user: user.name,
            user_id: user.user_id,
            avatar: user.avatar,
            time_sent: new_date,
            concern_id: user.room
          }
        })
        .then(() => {
          io.to(`${user.room}`).emit("message", {
            text: message,
            user: user.name,
            user_id: user.user_id,
            avatar: user.avatar,
            time_sent: new_date,
            concern_id: user.room
          });
        });
      callback();
    });

    socket.on("disconnect", () => {
      console.log("user disconnected to chat");
    });
  }
};
