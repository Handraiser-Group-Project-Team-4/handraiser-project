/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('classroom', {
        classroom_id: {
            type: 'serial',
            primaryKey: true,
        },
        class_key: {
            type: 'text',
            notNull: true,
        },
        class_id: {
            type: 'integer',
            notNull: true,
            references: 'classroom_details',
        },
        // user_id: {
        //     type: 'text',
        //     notNull: false,
        //     references: 'users',
        // },
    });
};

exports.down = pgm => {};
