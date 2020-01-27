/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('user_key', {
        user_key_id: {
            type: 'serial',
            primaryKey: true,
        },
        user_key: {
            type: 'text',
            notNull: true,
        },
    })
}
exports.down = pgm => {};
