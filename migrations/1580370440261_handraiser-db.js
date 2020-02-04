/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable("user_role", {
    user_role_id: {
      type: "serial",
      primaryKey: true
    },
    user_role: {
      type: "text",
      notNull: true
    }
  }),
    pgm.createTable("users", {
      user_id: {
        type: "text",
        primaryKey: true
      },
      user_role_id: {
        type: "integer",
        notNull: true,
        references: "user_role"
      },
      firstname: {
        type: "text",
        notNull: true
      },
      lastname: {
        type: "text",
        notNull: true
      },
      email: {
        type: "text",
        notNull: true
      },
      avatar: {
        type: "text",
        notNull: true
      },
      user_status: {
        type: "boolean",
        notNull: true
      },
      dark_mode: {
        type: "boolean",
        notNull: true
      }
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
    pgm.createTable("classroom_students", {
      classroom_students_id: {
        type: "serial",
        primaryKey: true
      },
      class_id: {
        type: "integer",
        notNull: true,
        references: "classroom_details"
      },
      user_id: {
        type: "text",
        notNull: true,
        references: "users"
      },
      date_joined: {
        type: "text",
        notNull: true
      }
    }),
    pgm.createTable("classroom", {
      classroom_id: {
        type: "serial",
        primaryKey: true
      },
      class_id: {
        type: "integer",
        notNull: true,
        references: "classroom_details"
      },
      class_key: {
        type: "text",
        notNull: true
      }
    }),
    pgm.createTable("concern", {
      concern_id: {
        type: "serial",
        primaryKey: true
      },
      mentor_id: {
        type: "text",
        notNull: false,
        references: "users"
      },
      student_id: {
        type: "text",
        notNull: true,
        references: "users"
      },
      concern_title: {
        type: "text",
        notNull: true
      },
      concern_status: {
        type: "text",
        notNull: true
      }
    }),
<<<<<<< HEAD
    pgm.createTable("messages", {
      message_id: {
        type: "serial",
        primaryKey: true
      },
      concern_id: {
        type: "integer",
        notNull: true,
        references: "concern"
      },
      message: {
        type: "jsonb",
        notNull: true
      }
    }),
    pgm.sql(
      `INSERT INTO classroom_details (class_title, class_description, class_created, class_ended, class_status) VALUES('Sample Title #2', 'Sample Description #2', 'January 1, 2019', null, 'active') `
    );
  pgm.sql(
    `INSERT INTO classroom (class_key, class_id) VALUES ('qwerty_key for class#2', 1)`
  );

    pgm.createTable('concern', {
        concern_id: {
            type: 'serial',
            primaryKey: true,
        },
        class_id: {
            type: 'integer',
            notNull: true,
            references: 'classroom_details',
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
<<<<<<< HEAD
    pgm.sql(`INSERT INTO users (user_id, user_role_id, firstname, lastname, email, avatar, user_status, dark_mode) 
    VALUES ('100867400409639305310', 1, 'Vince Gerard', 'Ludovice', 'vince.ludovice@boom.camp', 'https://lh3.googleusercontent.com/a-/AAuE7mDWCzeeRDfkjldWIhUYCxVQimKeabceug_WIpYo=s96-c', false, false)`)
>>>>>>> d9ec2994bab0e0ec2c74aba939cde8ed08b08e51
=======
    pgm.sql(`INSERT INTO users (user_id, user_approval_status_id, user_role_id, firstname, lastname, email, avatar, user_status, dark_mode, reason_disapproved) 
    VALUES ('100867400409639305310', 4, 1, 'Vince Gerard', 'Ludovice', 'vince.ludovice@boom.camp', 'https://lh3.googleusercontent.com/a-/AAuE7mDWCzeeRDfkjldWIhUYCxVQimKeabceug_WIpYo=s96-c', false, false, null)`)
   
>>>>>>> 07075fff3faf79fc9b7e818dad98f074ca8637db

  pgm.sql(`INSERT INTO user_role (user_role) VALUES ('admin')`);
  pgm.sql(`INSERT INTO user_role (user_role) VALUES ('mentor')`);
  pgm.sql(`INSERT INTO user_role (user_role) VALUES ('student')`);
  pgm.sql(`INSERT INTO users (user_id, user_role_id, firstname, lastname, email, avatar, user_status, dark_mode) 
      VALUES ('100867400409639305310', 1, 'Vince Gerard', 'Ludovice', 'vince.ludovice@boom.camp', 'https://lh3.googleusercontent.com/a-/AAuE7mDWCzeeRDfkjldWIhUYCxVQimKeabceug_WIpYo=s96-c', false, false)`);
  pgm.sql(`INSERT INTO users (user_id, user_role_id, firstname, lastname, email, avatar, user_status, dark_mode) 
      VALUES ('108097263522644779627', 3, 'Noe Philip Gabriel', 'Restum', 'noe.restum@boom.camp', 'https://lh3.googleusercontent.com/a-/AAuE7mDWCzeeRDfkjldWIhUYCxVQimKeabceug_WIpYo=s96-c', false, false)`);
  pgm.sql(`INSERT INTO users (user_id, user_role_id, firstname, lastname, email, avatar, user_status, dark_mode) 
      VALUES ('115228546838892635171', 2, 'Jake', 'Balbedina', 'jake.balbedina@boom.camp', 'https://lh3.googleusercontent.com/a-/AAuE7mDWCzeeRDfkjldWIhUYCxVQimKeabceug_WIpYo=s96-c', false, false)`);
  pgm.sql(
    `INSERT INTO concern (mentor_id, student_id, concern_title, concern_status) VALUES ('115228546838892635171', '108097263522644779627', 'NOE NEEDS HEL!', 'pending')`
  );
  pgm.sql(
    `INSERT INTO classroom_students(class_id, user_id, date_joined) VALUES(1, 108097263522644779627, 01/31/2020)`
  );
  pgm.sql(
    `insert into messages(concern_id, message) values(1,'{"user": "Noelle Marie Angelica Quimson", "text": "Oof", "time_sent": "Feb 23, 2020, 09:34 AM"}')`
  );
  pgm.sql(
    `insert into messages(concern_id, message) values(1,'{"user": "Noe Philip Gabriel Restum", "text": "ds", "time_sent": "Feb 03, 2020, 09:34 AM"}')`
  );
  pgm.sql(
    `INSERT INTO classroom_details (class_title, class_description, class_created, class_ended, class_status) VALUES('Sample Title #2', 'Sample Description #2', 'January 1, 2019', null, 'active') `
  );
  pgm.sql(
    `INSERT INTO classroom (class_key, class_id) VALUES ('qwerty_key for class#2', 1)`
  );
};

exports.down = pgm => {};
