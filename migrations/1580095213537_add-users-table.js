/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('users', {
        user_id: {
            type: 'text',
            primaryKey: true,
        },
        // user_id: {
        //     type: 'serial',
        //     primaryKey: true,
        // },
        firstname: {
            type: 'text',
            notNull: true,
        },
        lastname: {
            type: 'text',
            notNull: true,
        },
        email: {
            type: 'text',
            notNull: true,
        },
        avatar: {
            type: 'text',
            notNull: true,
        },
        user_status: {
            type: 'text',
            notNull: true,
        },
        user_key_id: {
            type: 'integer',
            notNull: false,
            references: '"user_key"',
        },
        user_role_id: {
            type: 'integer',
            notNull: true,
            references: '"user_role"',
        },
    });
};

exports.down = pgm => {};
