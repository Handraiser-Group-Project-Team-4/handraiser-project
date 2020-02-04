module.exports = {
	create: (req, res) => {
		const db = req.app.get('db');
		const {
			class_id,
			mentor_id,
			student_id,
			concern_title,
			concern_status
		} = req.body;

		db.concern
			.insert({
				class_id,
				mentor_id,
				student_id,
				concern_title,
				concern_status
			})
			.then(concern => {
				res.status(201).json(concern);
			})
			.catch(err => {
				console.log(err);
				res.status(500).end();
			});
	},
	list: (req, res) => {
		const db = req.app.get('db');
		db.query(`SELECT * FROM concern WHERE class_id = ${req.params.id}`)
			.then(concern => res.status(200).json(concern))
			.catch(err => {
				console.log(err);
				res.status(500).end();
			});
	},
	update: (req, res) => {
		const db = req.app.get('db');
		const { concern_status, mentor_id } = req.body;
		db.concern
			.update(req.params.id, { concern_status, mentor_id })
			.then(concern => res.status(200).json(concern))
			.catch(err => {
				console.log(err);
				res.status(500).end();
			});
	},
	delete: (req, res) => {
		const db = req.app.get('db');
		const id = req.params.id;
		db.query(`DELETE FROM concern where concern_id = ${id}`)
			.then(concern => {
				res.status(201).json(concern);
			})
			.catch(err => {
				console.log(err);
				res.status(500).end();
			});
	}
};
