module.exports = {
	list: (req, res) => {
		const db = req.app.get('db');
		db.query(`SELECT * FROM concern WHERE class_id = ${req.params.id}`)
			.then(concern => res.status(200).json(concern))
			.catch(err => {
				console.log(err);
				res.status(500).end();
			});
	},
	action: (req, res) => {
		const db = req.app.get('db');
		const { concern_status, mentor_id } = req.body;
		db.concern
			.update(req.params.id, { concern_status, mentor_id })
			.then(concern => res.status(200).json(concern))
			.catch(err => {
				console.log(err);
				res.status(500).end();
			});
	}
};
