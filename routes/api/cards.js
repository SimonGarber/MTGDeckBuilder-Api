// const express = require('express');
// const mongodb = require('mongodb');

// const router = express.Router();

// //Get Cards
// router.get('/', async (req, res) => {
//   console.log(req);
//   const cards = await loadCardsCollection();
//   const card = req.params.card;
//   res.send(await cards.find({ name: `"${card}"` }).toArray());
// });

// async function loadCardsCollection() {
//   const client = await mongodb.MongoClient.connect(
//     'mongodb+srv://admin:admin1234@cluster0-dposj.mongodb.net/test?retryWrites=true&w=majority',
//     {
//       useUnifiedTopology: true
//     }
//   );
//   return client.db('mtgcards').collection('data');
// }
// module.exports = router;
