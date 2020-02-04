/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('user_role', {
        user_role_id: {
            type: 'serial',
            primaryKey: true,
        },
        user_role: {
            type: 'text',
            notNull: true,
        },
    }),
    pgm.createTable('approval',{
        approval_id:{
            type: 'serial',
            primaryKey: true
        },
        approval_status: {
            type: 'text',
            notNull: true,
        }
    }),
    pgm.createTable('users', {
        user_id: {
            type: 'text',
            primaryKey: true,
        },
        user_role_id: {
            type: 'integer',
            notNull: true,
            references: 'user_role',
        },
        user_approval_status_id:{
            type: 'integer',
            notNull: true,
            references: 'approval',
        },
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
            type: 'boolean',
            notNull: true,
        },
        dark_mode: {
            type: 'boolean',
            notNull: true,
        },
        reason_disapproved: {
            type: 'text',
            notNull: false,
        }
    }),
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
    }),
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
        date_joined: {
            type: 'text',
            notNull: true
        }
    }),
    pgm.createTable('classroom', {
        classroom_id: {
            type: 'serial',
            primaryKey: true,
        },
        class_id: {
            type: 'integer',
            notNull: true,
            references: 'classroom_details',
        },
        class_key: {
            type: 'text',
            notNull: true,
        },
    }),
    pgm.createTable('concern', {
        concern_id: {
            type: 'serial',
            primaryKey: true,
        },
        mentor_id: {
            type: 'text',
            notNull: false,
            references: 'users',
        },
        student_id: {
            type: 'text',
            notNull: true,
            references: 'users',
        },
        concern_title: {
            type: 'text',
            notNull: true,
        },
        concern_status: {
            type: 'text',
            notNull: true,
        },
    }),
    pgm.createTable('messages', {
        message_id: {
            type: 'serial',
            primaryKey: true,
        },
        concern_id: {
            type: 'integer',
            notNull: true,
            references: 'concern',
        },
        message: {
            type: 'jsonb',
            notNull: true,
        },
    }),
    pgm.sql(`INSERT INTO approval (approval_status) VALUES ('Approved')`)
    pgm.sql(`INSERT INTO approval (approval_status) VALUES ('Pending')`)
    pgm.sql(`INSERT INTO approval (approval_status) VALUES ('Disapproved')`)
    pgm.sql(`INSERT INTO approval (approval_status) VALUES ('NoReqSent')`)
    pgm.sql(`INSERT INTO user_role (user_role) VALUES ('admin')`)
    pgm.sql(`INSERT INTO user_role (user_role) VALUES ('mentor')`)
    pgm.sql(`INSERT INTO user_role (user_role) VALUES ('student')`)
    pgm.sql(`INSERT INTO users (user_id, user_approval_status_id, user_role_id, firstname, lastname, email, avatar, user_status, dark_mode, reason_disapproved) 
    VALUES ('100867400409639305310', 4, 1, 'Vince Gerard', 'Ludovice', 'vince.ludovice@boom.camp', 'https://lh3.googleusercontent.com/a-/AAuE7mDWCzeeRDfkjldWIhUYCxVQimKeabceug_WIpYo=s96-c', false, false, null)`)
   

};

exports.down = pgm => {};
