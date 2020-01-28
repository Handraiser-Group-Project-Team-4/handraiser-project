const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const secret = require('../../secret')

module.exports = {
    list: (req, res) => {
        const db = req.app.get('db')

        db.query(`SELECT * FROM classroom_details`)
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
        const {class_id, user_id, input_key} = req.body
        
        db.query(`SELECT * FROM classroom WHERE class_id = ${class_id} AND class_key = '${input_key}'`)
        .then(classroom => {
            if(classroom.length !== 0){
                db.query(`INSERT INTO classroom_students (class_id, user_id) VALUES (${class_id}, ${user_id})`)
                .then(classroom_students => res.status(201).json(classroom_students) )
            }
            else
                res.status(400).end();
        })
        .catch(err => {
            console.log(err)
            res.status(500).end();
        })
    }
}