module.exports = {
  adminSockets: (socket, io, db) => {
    socket.on(`mentorRequest`, ({ data }) => {
      io.emit("fetchMentorRequest");
    });

    socket.on(`handleRoleRequest`, ({ user_id, approval_status }) => {
      // db.users.find(user_id)
      // .then(user => {
      io.emit("notifyUser", { user_id, approval_status });
      // })
    });

    socket.on(`renderCohort`, () => {
      io.emit("fetchCohort");
    });

    socket.on(`changeUserRole`, ({ user_id, user_role_id }) => {
      // db.users.find(user_id)
      // .then(user => {
      // console.log(user)
      if (user_role_id === 2) io.emit("studentToMentor", user_id);
      else if (user_role_id === 3) io.emit("mentorToStudent", user_id);
      // })
    });

    socket.on(`studentKicked`, ({user_id, class_id}) => {
      db.classroom_details.find(class_id)
      .then(classroom => {
        io.emit("notifyKicked", {
          user_id, 
          classroom:{
            class_id: classroom.class_id,
            class_title: classroom.class_title
          }
        })
      })
      
    });
  }
};
