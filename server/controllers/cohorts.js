const keyGenerator = require("../keyGenerator");

module.exports = {
  list: (req, res) => {
    const db = req.app.get("db");

    db.query(
      `select classroom_details.class_id, classroom_details.class_title, classroom_details.class_description, 
    classroom_details.class_created, 
    classroom_details.class_ended, classroom_details.class_status, classroom.classroom_id, classroom.class_id, 
    classroom.class_key
    from classroom_details
    inner join classroom
    on classroom_details.class_id = classroom.class_id`
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
    const db = req.app.get('db')
    const {class_id, user_id, date_joined, input_key} = req.body
    db.query(`SELECT * FROM classroom WHERE class_id = ${class_id} AND class_key = '${input_key}'`)
    .then(classroom => {
        if(classroom.length !== 0){
            db.classroom_students.insert({class_id, user_id, date_joined})
            // db.query(`INSERT INTO classroom_students (class_id, user_id, date_joined) VALUES (${class_id}, '${user_id}, '${date_joined}')`)
            .then(classroom_students => res.status(201).json(classroom_students) )
        }
        else
            res.status(400).end();
    })
    .catch(err => {
        console.log(err)
        res.status(500).end();
    })
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
    const db = req.app.get('db');
    const {toggle_class_status} = req.query
    let class_status = (toggle_class_status === 'true')?'t':'f'

    db.classroom_details
      .update(
        {
          class_id: req.params.id
        },
        {  
          class_status
        }
      )
    .then(classroom => res.status(200).send(classroom))
    .catch(err => {
      console.err(err);
      res.status(500).end();
    });
  }
};
