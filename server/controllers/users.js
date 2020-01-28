const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const secret = require('../../secret')


module.exports = {
    login: (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.query
    
        db.query(`SELECT * FROM users WHERE user_id = '${user_id}'`)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).end();
        })
    },

    create: (req, res) => {
        const db = req.app.get('db')
        const {user_id, firstname, lastname, email, avatar,} = req.body

        db.query(`INSERT INTO users (user_id, firstname, lastname, email, avatar, user_status, user_role_id)
                VALUES ('${user_id}', '${firstname}', '${lastname}', '${email}', '${avatar}', 'active', 3)    
        `)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).end();
        })
    },

    fetch: (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.params.id


        db.users.find(user_id)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).end();
        })
    }
}