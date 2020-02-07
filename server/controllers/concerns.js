module.exports = {
  concernSockets: (socket, io, db) => {
    socket.on("joinConcern", ({ id }, callback) => {
      db.concern.find().then(res =>
        io.to(`${id}`).emit("concernData", {
          res
        })
      );
      socket.join(`${id}`);
      callback();
    });

    socket.on("sendConcern", ({ concern }, callback) => {
      const user = users.find(user => user.id === socket.id);
      db.concern.insert(concern).then(() =>
        db.concern.find().then(res =>
          io.to(`1`).emit("concernData", {
            res
          })
        )
      );
      callback();
    });

    socket.on("updateConcern", ({ id, concern_id, updateData }, callback) => {
      const { concern_status, mentor_id } = updateData;
      db.concern.update(concern_id, { concern_status, mentor_id }).then(() =>
        db.concern.find().then(res =>
          io.to(`${id}`).emit("concernData", {
            res
          })
        )
      );
      callback();
    });

    socket.on("deleteConcern", ({ id, concern_id }, callback) => {
      db.concern.destroy(concern_id).then(() =>
        db.concern.find().then(res =>
          io.to(`${id}`).emit("concernData", {
            res
          })
        )
      );
      callback();
    });
  }
};
