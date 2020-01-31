const keyGenerator = require('../keyGenerator')

module.exports = {
    list: (req, res) => {
        const db = req.app.get('db')

        db.classroom_details.find()
        .then(classroom => res.status(200).json(classroom) )
        .catch(err => {
            console.log(err)
            res.status(500).end();
        })
    },

    checkUser: (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.query
        
        db.query(`SELECT * FROM classroom_students WHERE class_id = ${req.params.id} AND user_id = '${user_id}'`)
        .then(classroom => res.status(200).json(classroom) )
        .catch(err => {
            console.log(err)
            res.status(500).end();
        })
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
        const db = req.app.get('db');
        const {class_title, class_description, class_created, class_status, user_id} = req.body;
  
        db.classroom_details.insert(
            {class_title, class_description, class_created, class_status},
            {fields: ['class_id', 'class_title', 'class_description', 'class_created', 'class_status']}
        )
        .then(classroom_details => {
            let key = keyGenerator.keyGen();

            db.query(`INSERT INTO classroom (class_key, class_id) VALUES('${key}', ${classroom_details.class_id})`)
            .then(classroom => {
                res.status(201).json({key})
                db.query(`INSERT INTO classroom_students(class_id, user_id, date_joined) 
                        VALUES(${classroom_details.class_id}, '${user_id}', '${class_created}')`)
                .then(res => console.log(res))
                .catch(err => req.status(500).end())
            })
            .catch(err => req.status(500).end())
        })
        .catch(err => {
            console.log(err)
            res.status(500).end();
        })
    }
}