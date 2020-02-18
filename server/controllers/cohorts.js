const keyGenerator = require("../keyGenerator");

module.exports = {
  list: (req, res) => {
    const db = req.app.get("db");
    const {value, user_id} = req.query;

    if(value != 1)
      db.query(
        `select cd.class_id, cd.class_title, cd.class_description, cd.class_created, cd.class_ended, cd.class_status,
        c.classroom_id, c.class_id, c.class_key
        from classroom_details cd
        inner join classroom c
        on cd.class_id = c.class_id order by cd.class_id asc`
      )
        .then(get => res.status(200).json(get))
        .catch(err => {
          console.error(err);
          res.status(500).end();
        });
    else{
      db.query(`SELECT * FROM classroom_students, classroom, classroom_details WHERE classroom_students.user_id = '${user_id}' 
              AND classroom_students.class_id = classroom.class_id 
              AND classroom_students.class_id = classroom_details.class_id 
              AND classroom.class_id = classroom_details.class_id order by classroom_students.class_id asc`)
        .then(get => res.status(200).json(get))
        .catch(err => {
          console.error(err);
          res.status(500).end();
        });
    }
  },

  viewCohort: (req, res) => {
    const db = req.app.get("db");

    db.query(
      `select classroom_students.date_joined, users.firstname, users.lastname,
       users.email, users.avatar, users.user_status, users.user_id, 
       classroom_details.class_title, classroom_details.class_created, 
       classroom_students.class_id, users.user_role_id 
      from classroom_students
      inner join users
      on classroom_students.user_id = users.user_id
      inner join classroom_details
      on  classroom_details.class_id = classroom_students.class_id
      where classroom_students.class_id = ${req.params.id}`
    )
      .then(get => res.status(200).json(get))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  },

  deleteStud: (req, res) => {
    const db = req.app.get("db");

    db.query(
      `delete from classroom_students where user_id = '${req.params.userId}' and class_id = ${req.params.classId}`
    )
      .then(get => res.status(200).json(get))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  },

  checkUser: (req, res) => {
    const db = req.app.get("db");
    const { user_id } = req.query;

    db.query(
      `SELECT * FROM classroom_students WHERE class_id = ${req.params.id} AND user_id = '${user_id}'`
    )
      .then(classroom => res.status(200).json(classroom))
      .catch(err => {
        console.log(err);
        res.status(500).end();
      });
  },

  submitKey: (req, res) => {
    const db = req.app.get("db");
    const { class_id, user_id, date_joined, input_key } = req.body;
    db.query(
      `SELECT * FROM classroom WHERE class_id = ${class_id} AND class_key = '${input_key}'`
    )
      .then(classroom => {
        if (classroom.length !== 0) {
          db.classroom_students
            .insert({ class_id, user_id, date_joined })
            // db.query(`INSERT INTO classroom_students (class_id, user_id, date_joined) VALUES (${class_id}, '${user_id}, '${date_joined}')`)
            .then(classroom_students =>
              res.status(201).json(classroom_students)
            );
        } else res.status(400).end();
      })
      .catch(err => {
        console.log(err);
        res.status(500).end();
      });
  },

  create: (req, res) => {
    // console.log(keyGenerator.keyGen())
    const db = req.app.get("db");
    const {
      class_title,
      class_description,
      class_created,
      class_status,
      user_id
    } = req.body;
    db.classroom_details
      .insert(
        { class_title, class_description, class_created, class_status },
        {
          fields: [
            "class_id",
            "class_title",
            "class_description",
            "class_created",
            "class_status"
          ]
        }
      )
      .then(classroom_details => {
        let key = keyGenerator.keyGen();
        db.query(
          `INSERT INTO classroom (class_key, class_id) VALUES('${key}', ${classroom_details.class_id})`
        )
          .then(classroom => {
            res.status(201).json({ key });
            db.query(
              `INSERT INTO classroom_students(class_id, user_id, date_joined) 
                    VALUES(${classroom_details.class_id}, '${user_id}', '${class_created}')`
            )
              .then(res => console.log(res))
              .catch(err => req.status(500).end());
          })
          .catch(err => req.status(500).end());
      })
      .catch(err => {
        console.log(err);
        res.status(500).end();
      });
  },

  //Zion
  make: (req, res) => {
    const db = req.app.get("db");
    const {
      class_title,
      class_description,
      class_created,
      class_status,
      class_id,
      class_key
    } = req.body;
    db.classroom_details
      .save(
        {
          class_title,
          class_description,
          class_created,
          class_status,
          classroom: [
            {
              class_id,
              class_key
            }
          ]
        },
        {
          deepInsert: true
        }
      )
      .then(post => res.status(201).json(post))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  },

  changeKey: (req, res) => {
    const db = req.app.get("db");
    const { class_id, class_key } = req.body;
    db.classroom
      .update(
        {
          classroom_id: req.params.id
        },
        {
          class_id: class_id,
          class_key: class_key
        }
      )
      .then(post => res.status(201).send(post))
      .catch(err => {
        console.err(err);
        res.status(500).end();
      });
  },

  toggleCohort: (req, res) => {
    const db = req.app.get("db");
    const { class_status } = req.body;
    // let class_status = toggle_class_status === "true" ? "true" : "false";

    db.classroom_details
      .update(
        {
          class_id: req.params.id
        },
        {
          class_status: class_status
        }
      )
      .then(classroom => res.status(200).send(classroom))
      .catch(err => {
        console.err(err);
        res.status(500).end();
      });
  },

  deleteClass: (req, res) => {
    const db = req.app.get("db");

    db.query(
      `delete from classroom where class_id = ${req.params.id};
      delete from classroom_details where class_id = ${req.params.id}`
    )
      .then(get => res.status(200).json(get))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  },

  assignMentor: (req, res) => {
    const db = req.app.get("db");
    const { class_id, user_id, date_joined } = req.body;
    db.classroom_students
      .save(
        {
          class_id,
          user_id,
          date_joined,
        }
      )
      .then(post => res.status(201).json(post))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  },

  classDetails: (req, res) => {
    const db = req.app.get('db');
    
    db.query(`SELECT * FROM classroom_details, classroom, classroom_students, users WHERE classroom_students.class_id = ${req.params.id}
              AND users.user_id = classroom_students.user_id
              AND classroom_students.class_id = classroom.class_id 
              AND classroom_students.class_id = classroom_details.class_id 
              AND classroom.class_id = classroom_details.class_id`)
    .then(classDetail => res.status(200).json(classDetail))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
  }
};