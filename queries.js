const { Pool } = require('pg');

const pool = new Pool({
  port: 5432,
  password: '',
  host: 'localhost',
  user: 'simongarber',
  database: 'postgres',
  max: 10
});

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserByEmail = (request, response) => {
  console.log(request);
  const email = request.params.email;
  pool.query(
    'SELECT * FROM users WHERE user_email = $1',
    [email],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createUser = (request, response) => {
  const user_email = request.body.username;
  const user_password_digest = request.body.userpassword;
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
};

const saveCard = (request, response) => {
  const user_email = request.body.username;
  const card_userID = request.body.card.id;
  let values = [user_email, card_userID];
  console.log(card_id);
  pool.connect((err, db, done) => {
    if (err) {
      return response.status(400).send(err);
    } else {
      pool.query(
        'INSERT INTO cards (user_email, card_userID) VALUES($1, $2)',
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
};
// ``SELECT  data->'name' as name from mtgcards`
// Select *
// from "Person"
// Where emails @> '[{"type": "personal"}]'
// SELECT * FROM users WHERE data->>'name' = 'John';
// dbt3=# explain select * from products where order_details @> '{"l_shipmode" : "AIR"}';
// select * from test_json where details #> '{Location,State}'='"NSW"';
// select item_code, order_details->'l_shipdate' as shipment_date from product_details ;
// select * from products where order_details @> '{"l_shipmode" : "AIR"}'
const getCards = (request, response) => {
  const card = request.params.card;
  pool.connect((err, db) => {
    if (err) {
      throw err;
    } else {
      db.query(
        `
        
    SELECT * FROM mtgcards WHERE lower(data::text)::jsonb @> lower('{"name":"${card}"}')::jsonb`,

        (error, table) => {
          if (error) {
            throw error;
          } else {
            return response.json(table.rows);
          }
        }
      );
    }
  });
};

// this returns all named cards from the table mtgcards

module.exports = {
  getUserByEmail,
  getUsers,
  createUser,
  saveCard,
  getCards
};
