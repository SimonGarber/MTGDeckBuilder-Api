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

app.get('/', (request, response) => {
  response.json({ info: 'node.js, express, Postgres' });
});
app.get('/api/fetch-user/:email', db.getUserByEmail);
app.get('/api/cards/:card', db.getCards);
// app.get('https://api.scryfall.com/cards?page=3',(request,response) => {
//   return response.json(response)
// })
app.post('/api/new-user', db.createUser);

app.post('api/save-card', db.saveCard);
app.listen(PORT, () => console.log('listening on port ' + PORT));
