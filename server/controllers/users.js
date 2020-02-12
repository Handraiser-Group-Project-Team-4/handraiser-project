const jwt = require('jsonwebtoken');

module.exports = {
	login: (req, res) => {
		const db = req.app.get('db');
		const { user_id } = req.query;

		db.query(`SELECT * FROM users WHERE user_id = '${user_id}'`)
			.then(user => {
				let user_role_id;

				if (user.length > 0) {
					user_role_id = user[0].user_role_id;
					db.query(
						`UPDATE users SET user_status=true WHERE user_id='${user_id}'`
					);
				}

				const token = jwt.sign(
					{ user_id, user_role_id },
					process.env.SECRET_KEY
				);
				res.status(200).json({ ...user, token });
			})
			.catch(err => {
				console.log(err);
				res.status(500).end();
			});
	},

	create: (req, res) => {
		const db = req.app.get('db');
		const { user_id, firstname, lastname, email, avatar } = req.body;

		db.query(
			`INSERT INTO users (user_id, firstname, lastname, email, avatar, user_status, reason_disapproved, user_role_id, user_approval_status_id, dark_mode)
                VALUES ('${user_id}', '${firstname}', '${lastname}', '${email}', '${avatar}', true, null, 3, 4, false)    
        `
		)
			.then(user => {
				res.status(201).json(user);
			})
			.catch(err => {
				console.log(err);
				res.status(500).end();
			});
	},

	fetch: (req, res) => {
		const db = req.app.get('db');
		const { chat } = req.query;
		if (chat) {
			let users = {};
			db.query(
				`SELECT * FROM users, concern WHERE users.user_id = '${req.params.id}' AND concern.concern_id = 40`
			).then(concern => {
				users.concern = concern[0];
				// res.status(200).json(...concern)
				db.query(
					`SELECT message FROM messages WHERE concern_id = ${concern[0].concern_id}`
				).then(messages => {
					let temp = [];
					messages.map(x => {
						temp.push(x.message);
					});
					users.messages = temp;
					res.status(200).json(users);
				});
			});
		} else {
			db.users
				.find(req.params.id)
				.then(user => {
					// console.log(user)
					res.status(200).json(user);
				})
				.catch(err => {
					console.log(err);
					res.status(500).end();
				});
		}
	},

	logout: (req, res) => {
		const db = req.app.get('db');

		db.query(
			`UPDATE users SET user_status=false WHERE user_id='${req.params.id}'`
		);
	},

	pending: (req, res) => {
		const db = req.app.get('db');

		db.query(`select * from users where user_approval_status_id = 2`)
			.then(get => res.status(200).json(get))
			.catch(err => {
				console.error(err);
				res.status(500).end();
			});
	},

	approved: (req, res) => {
		const db = req.app.get('db');

		db.query(`select * from users where user_approval_status_id = 1`)
			.then(get => res.status(200).json(get))
			.catch(err => {
				console.error(err);
				res.status(500).end();
			});
	},
	request: (req, res) => {
		const db = req.app.get('db');
		db.query(
			`UPDATE users set user_approval_status_id=2 WHERE user_id = '${req.params.id}'`
		)
			.then(get => res.status(200).json(get))
			.catch(err => {
				console.error(err);
				res.status(500).end();
			});
	},
	disapproved: (req, res) => {
		const db = req.app.get('db');

		db.query(`select * from users where user_approval_status_id = 3`)
			.then(get => res.status(200).json(get))
			.catch(err => {
				console.error(err);
				res.status(500).end();
			});
	},
	movingToApprove: (req, res) => {
		const db = req.app.get('db');
		const { user_approval_status_id } = req.body;
		db.users
			.update(
				{
					user_id: req.params.id
				},
				{
					user_approval_status_id: user_approval_status_id,
					user_role_id: 2
				}
			)
			.then(post => res.status(201).send(post))
			.catch(err => {
				console.err(err);
				res.status(500).end();
			});
	},
	movingToDisapprove: (req, res) => {
		const db = req.app.get('db');
		const { user_approval_status_id, reason_disapproved } = req.body;
		db.users
			.update(
				{
					user_id: req.params.id
				},
				{
					user_approval_status_id: user_approval_status_id,
					reason_disapproved: reason_disapproved
				}
			)
			.then(post => res.status(201).send(post))
			.catch(err => {
				console.err(err);
				res.status(500).end();
			});
	}
};
