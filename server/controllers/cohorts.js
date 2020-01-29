const jwt = require('jsonwebtoken');
const secret = require('../../secret')

module.exports = {
    list: (req, res) => {
        const db = req.app.get('db')

        if (!req.headers.authorization) 
            return res.status(401).end();
          
        try {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, secret); 

            db.query(`SELECT * FROM classroom_details`)
            .then(classroom => res.status(200).json(classroom) )
            .catch(err => {
                console.log(err)
                res.status(500).end();
            })
        } catch (err) {
            console.error(err);
            res.status(401).end();
        }
    },

    checkUser: (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.query
        
        if (!req.headers.authorization) 
            return res.status(401).end();
        
        try {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, secret); 

            db.query(`SELECT * FROM classroom_students WHERE class_id = ${req.params.id} AND user_id = '${user_id}'`)
            .then(classroom => res.status(200).json(classroom) )
            .catch(err => {
                console.log(err)
                res.status(500).end();
            })
        } catch (err) {
            console.error(err);
            res.status(401).end();
        }
    },

    submitKey: (req, res) => {
        const db = req.app.get('db')
        const {class_id, user_id, input_key} = req.body
        
        if (!req.headers.authorization) 
            return res.status(401).end();
         
        try {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, secret); 

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
        } catch (err) {
            console.error(err);
            res.status(401).end();
        }
    }
}