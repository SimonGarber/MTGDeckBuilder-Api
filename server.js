let express = require('express');
let bodyParser = require('body-parser');
let pg = require('pg');
const PORT = 3001;
let app = express();
let pool = new pg.Pool({
  port: 5432,
  password: '',
  host: 'localhost',
  user: 'simongarber',
  database: 'postgres',
  max: 10
});

pool.connect((err, db, done) => {
  if (err) {
    return console.log(err);
  } else {
    db.query('SELECT * from users', (err, table) => {
      if (err) {
        console.log(err);
      } else {
        console.log(table);
      }
    });
  }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.listen(PORT, () => console.log('listening on port ' + PORT));
