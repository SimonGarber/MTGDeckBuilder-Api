const { Pool } = require('pg');
const mongodb = require('mongodb');
const queryString = require('querystring');

const pool = new Pool({
  port: 5432,
  password: '',
  host: 'localhost',
  user: 'simongarber',
  database: 'postgres',
  max: 10
});

// Query that returns a list of users in the db
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};
// TODO: add bcrypt and jsonwebtoken for user authentication with corresponding logic
// Query that returns a single user from db by username/email
const getUserByEmail = (request, response) => {
  console.log(request);
  const email = request.params.email;
  const password = request.params.password;
  const values = [email, password];
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
// Query that adds a user to the db by email and password params from the front end
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
// Query that saves a selected card to the db
// TODO: create a connection between the users table, cards table and the mtgcards table
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
// Query that runs a search against the mtgcards db based on a match with any text in any key within the card object
const getCards = async (request, response) => {
  const cards = await loadCardsCollection();

  const { name, set, cmc, typeLine, oracleText } = request.query;
  const queryObj = {};
  if (name !== '') {
    queryObj['name'] = { $regex: `.*${name}.*` };
  }
  if (set !== '') {
    queryObj['set'] = `${set}`;
  }
  if (cmc !== '') {
    queryObj['cmc'] = parseInt(cmc);
  }
  if (typeLine !== '') {
    queryObj['type_line'] = { $regex: `.*${typeLine}.*` };
  }
  if (oracleText !== '') {
    queryObj['oracle_text'] = { $regex: `.*${oracleText}.*` };
  }

  response.send(
    await cards
      .find({
        ...queryObj
      })
      .toArray()
  );

  async function loadCardsCollection() {
    const client = await mongodb.MongoClient.connect(
      'mongodb+srv://admin:admin1234@cluster0-dposj.mongodb.net/test?retryWrites=true&w=majority',
      {
        useUnifiedTopology: true,
        ignoreUndefined: true
      }
    );
    return client.db('mtgcards').collection('data');
  }
};

const setSearch = (request, response) => {
  const set = request.params.set;
  pool.connect((err, db) => {
    console.log(request.params);
    if (err) {
      throw err;
    } else {
      db.query(
        `
        SELECT * FROM mtgcards WHERE (data->> 'set') = '${set}';`,
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

module.exports = {
  getUserByEmail,
  getUsers,
  createUser,
  saveCard,
  getCards,
  setSearch
};
