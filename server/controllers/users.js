const jwt = require('jsonwebtoken');
const secret = require('../../secret')

module.exports = {
    login: (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.query
    
        db.query(`SELECT * FROM users WHERE user_id = '${user_id}'`)
        .then(user => {
            const token = jwt.sign({ user_id }, secret);
            res.status(200).json({ ...user, token });
        })
        .catch(err => {
            console.log(err)
            res.status(500).end();
        })
    },

    create: (req, res) => {
        const db = req.app.get('db')
        const {user_id, firstname, lastname, email, avatar,} = req.body

        if (!req.headers.authorization) 
            return res.status(401).end();

        try {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, secret); 

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
        } catch (err) {
            console.error(err);
            res.status(401).end();
        }
    },

    fetch: (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.params.id

        if (!req.headers.authorization) 
            return res.status(401).end();

        try {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, secret); 

            db.users.find(user_id)
            .then(user => {
                res.status(200).json(user)
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