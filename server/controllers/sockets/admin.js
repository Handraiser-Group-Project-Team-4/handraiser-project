module.exports = {
  adminSockets: (socket, io, db) => {
    let userIsActive=[];

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

    socket.on('userAssignedMentor', ({user_id, class_id}) => {
      db.classroom_details.find({class_id})
      .then(classroom => {
        console.log(classroom[0].class_title)
        io.emit('notifyAssignedMentor', {user_id, class_title: classroom[0].class_title})
      })
    })

    // socket.on('activeUser', (callback) => {
    //   let temp=[];
    //   db.users.find({user_status: "t"}, {"fields":[`user_id`]})
    //   .then(active => {
    //     active.map(x => {
    //       temp.push(x.user_id)
    //     })
    //     io.emit('displayActiveUser', {userIsActive: temp})
    //   })
    //   .catch(err => console.log(err))

    //   callback();
    // });

    // socket.on('logOutUser', ({user_id}) => {
    //   // userIsActive.splice(userIsActive.indexOf(user_id), 1)
    //   // io.emit('renderActiveUser', {userIsActive})
    //   // console.log(userIsActive)
    // })
  }
};
