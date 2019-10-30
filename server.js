const express = require('express');
const bodyParser = require('body-parser');
const PORT = 3001;
const app = express();
const db = require('./queries');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(request, response, next) {
  response.header('Access-Control-Allow-Origin', '*');
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
// Root
app.get('/', (request, response) => {
  response.json({ info: 'node.js, express, Postgres' });
});
// User login Route
app.get('/api/fetch-user/:email', db.getUserByEmail);
// Card Search Route
app.get('/api/cards/:card', db.getCards);
// Search by Set
app.get('/api/sets/:set', db.setSearch);
// Create new user Route
app.post('/api/new-user', db.createUser);
// Add card to collection Route
app.post('api/save-card', db.saveCard);

app.listen(PORT, () => console.log('listening on port ' + PORT));
