
const express = require('express');
const massive = require('massive');
const cors = require('cors')
const users = require('./controllers/users')

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
  app.post('/api/users', users.create)
  app.get('/api/users/:id', users.fetch)



  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});