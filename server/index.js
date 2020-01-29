const express = require('express');
const massive = require('massive');
const cors = require('cors')
const auth = require('./controllers/auth')
const users = require('./controllers/users')
const cohorts = require('./controllers/cohorts')

massive({
  host: 'localhost',
  port: 5435,
  database: 'handraiser',
  user: 'postgres',
  password: 'handraiser',
}).then(db => {
  const app = express();

  app.set('db', db);

  app.use(express.json());
  app.use(cors())

  app.get('/api/users', users.login)

  app.use(auth.header)
  
  // USERS
  app.patch('/api/logout/:id', users.logout)
  app.post('/api/users', users.create)
  app.get('/api/users/:id', users.fetch)

  // COHORTS
  app.get('/api/cohorts', cohorts.list)
  app.post('/api/cohorts', cohorts.create)
  app.get('/api/cohort-check/:id', cohorts.checkUser)
  app.post('/api/submit-key/', cohorts.submitKey)



  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});