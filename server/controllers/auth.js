const jwt = require('jsonwebtoken');
const secret = require('../../secret')

module.exports = {
    header: (req, res, next) => {
        if (!req.headers.authorization) 
        return res.status(401).end();

        try {
            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, secret); 

            next();

        } catch (err) {
            console.error(err);
            res.status(401).end();
        }
    }
}