const mongodb = require('mongodb');

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

module.exports = {
  getCards
};
