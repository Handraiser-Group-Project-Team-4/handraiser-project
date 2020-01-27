module.exports = {
    login: (req, res) => {
        const db = req.app.get('db')
        const {email} = req.query
       
    
        db.query(`SELECT * FROM users WHERE email = ${email}`)
        .then(user => {
            res.status(200).json(user)
            // else{
            //     db.user_key.insert({user_key: `pending`})
            //     .then(key => {
            //         db.users.insert({user_id, avatar, email, firstname, lastname, user_key_id})
            //     })
            // }
        })
        .catch(err => {
            console.log(err)
            res.status(500).end();
        })
    },

    create: (req, res) => {
        const db = req.app.get('db')
        const {avatar, email, firstname, lastname} = req.body

        db.query(`INSERT INTO users (firstname, lastname, email, avatar, user_status, user_role_id)
                VALUES (${firstname}, ${lastname}, ${email}, ${avatar}, active, 3)    
        `)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            console.log(err)
            res.status(500).end();
        })
    }
}