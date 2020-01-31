/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
	pgm.createTable('user_role', {
		user_role_id: {
			type: 'serial',
			primaryKey: true
		},
		user_role: {
			type: 'text',
			notNull: true
		}
	}),
		pgm.createTable('users', {
			user_id: {
				type: 'text',
				primaryKey: true
			},
			user_role_id: {
				type: 'integer',
				notNull: true,
				references: 'user_role'
			},
			firstname: {
				type: 'text',
				notNull: true
			},
			lastname: {
				type: 'text',
				notNull: true
			},
			email: {
				type: 'text',
				notNull: true
			},
			avatar: {
				type: 'text',
				notNull: true
			},
			user_status: {
				type: 'boolean',
				notNull: true
			},
			dark_mode: {
				type: 'boolean',
				notNull: true
			}
		}),
		pgm.createTable('classroom_details', {
			class_id: {
				type: 'serial',
				primaryKey: true
			},
			class_title: {
				type: 'text',
				notNull: true
			},
			class_description: {
				type: 'text',
				notNull: true
			},
			class_created: {
				type: 'text',
				notNull: true
			},
			class_ended: {
				type: 'text',
				notNull: false
			},
			class_status: {
				type: 'text',
				notNull: true
			}
		}),
		pgm.createTable('classroom_students', {
			classroom_students_id: {
				type: 'serial',
				primaryKey: true
			},
			class_id: {
				type: 'integer',
				notNull: true,
				references: 'classroom_details'
			},
			user_id: {
				type: 'text',
				notNull: true,
				references: 'users'
			},
			date_joined: {
				type: 'text',
				notNull: true
			}
		}),
		pgm.createTable('classroom', {
			classroom_id: {
				type: 'serial',
				primaryKey: true
			},
			class_id: {
				type: 'integer',
				notNull: true,
				references: 'classroom_details'
			},
			class_key: {
				type: 'text',
				notNull: true
			}
		}),
		pgm.createTable('concern', {
			concern_id: {
				type: 'serial',
				primaryKey: true
			},
			mentor_id: {
				type: 'text',
				notNull: false,
				references: 'users'
			},
			student_id: {
				type: 'text',
				notNull: true,
				references: 'users'
			},
			class_id: {
				type: 'integer',
				notNull: true,
				references: 'classroom_details'
			},
			concern_title: {
				type: 'text',
				notNull: true
			},
			concern_status: {
				type: 'text',
				notNull: true
			}
		}),
		pgm.createTable('messages', {
			message_id: {
				type: 'serial',
				primaryKey: true
			},
			concern_id: {
				type: 'integer',
				notNull: true,
				references: 'classroom_details'
			},
			message: {
				type: 'text',
				notNull: true
			},
			message_time_stamp: {
				type: 'text',
				notNull: true
			}
		});
};

exports.down = pgm => {};
