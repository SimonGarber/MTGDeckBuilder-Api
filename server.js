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

// pool.connect((err, db, done) => {
//   if (err) {
//     return console.log(err);
//   } else {
//     let user_email = 'simon.garber@gmail.com';
//     let user_password_digest = 'password';
//     let id = Math.random().toFixed(3);
//     db.query(
//       'INSERT INTO users (user_email, user_password_digest, id) VALUES($1, $2, $3)',
//       [user_email, user_password_digest, id],
//       (err, table) => {
//         done();
//         if (err) {
//           console.log(err);
//         } else {
//           console.log('DB insert successful');
//         }
//       }
//     );
//   }
// });

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

app.post('/api/new-user', (request, response) => {
  const user_email = request.body.email;
  const user_password_digest = request.body.password;
  var id = Math.random().toFixed(3);
  let values = [user_email, user_password_digest, id];
  pool.connect((err, db, done) => {
    if (err) {
      return response.status(400).send(err);
    } else {
      db.query(
        'INSERT INTO users (user_email, user_password_digest, id) VALUES($1, $2, $3)',
        [...values],
        (err, table) => {
          done();
          if (err) {
            console.log(err);
          } else {
            response.status(201).send(request.body);
          }
        }
      );
    }
  });
});

app.listen(PORT, () => console.log('listening on port ' + PORT));
