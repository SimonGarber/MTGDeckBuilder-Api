const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

//Get Cards
router.get('/', async (req, res) => {
  const cards = await loadCardsCollection();
  res.send(
    await cards.find({ artist: 'Mark Tedin', type_line: 'Artifact' }).toArray()
  );
});

async function loadCardsCollection() {
  const client = await mongodb.MongoClient.connect(
    'mongodb+srv://admin:admin1234@cluster0-dposj.mongodb.net/test?retryWrites=true&w=majority',
    {
      useUnifiedTopology: true
    }
  );
  return client.db('mtgcards').collection('data');
}
module.exports = router;
