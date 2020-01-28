/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('classroom_details', {
        class_id: {
            type: 'serial',
            primaryKey: true,
        },
        class_title: {
            type: 'text',
            notNull: true,
        },
        class_description: {
            type: 'text',
            notNull: true,
        },
        class_created: {
            type: 'text',
            notNull: true,
        },
        class_ended: {
            type: 'text',
            notNull: false,
        },
        class_status: {
            type: 'text',
            notNull: true,
        },
    });
};

exports.down = pgm => {};
