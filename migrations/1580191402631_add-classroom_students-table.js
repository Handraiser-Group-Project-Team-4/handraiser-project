/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('classroom_students', {
        classroom_students_id: {
            type: 'serial',
            primaryKey: true,
        },
        class_id: {
            type: 'integer',
            notNull: true,
            references: 'classroom_details',
        },
        user_id: {
            type: 'text',
            notNull: true,
            references: 'users',
        },
    })
}

exports.down = pgm => {};
