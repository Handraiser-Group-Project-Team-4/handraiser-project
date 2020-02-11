module.exports = {
  concernSockets: (socket, io, db) => {
    socket.on("joinConcern", ({ id }, callback) => {
      db.concern.find({ class_id: id }).then(res =>
        io.to(`${id}`).emit("concernData", {
          res
        })
      );
      socket.join(`${id}`);
      callback();
    });

    socket.on("sendConcern", ({ concern }, callback) => {
      db.concern.insert(concern).then(() =>
        db.concern.find({ class_id: concern.class_id }).then(res =>
          io.to(`${concern.class_id}`).emit("concernData", {
            res
          })
        )
      );
      callback();
    });

    socket.on("updateConcern", ({ id, concern_id, updateData }, callback) => {
      const { concern_status, mentor_id } = updateData;
      db.concern.update(concern_id, { concern_status, mentor_id }).then(() =>
        db.concern.find({ class_id: id }).then(res =>
          io.to(`${id}`).emit("concernData", {
            res
          })
        )
      );
      callback();
    });

    socket.on("deleteConcern", ({ id, concern_id }, callback) => {
      db.concern.destroy(concern_id).then(() =>
        db.concern.find({ class_id: id }).then(res =>
          io.to(`${id}`).emit("concernData", {
            res
          })
        )
      );
      callback();
    });
  }
};
