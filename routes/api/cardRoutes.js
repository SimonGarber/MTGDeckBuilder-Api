const express = require("express");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const User = mongoose.model("User");
const router = express.Router();

// Add a card to a user's collection
router.put("/api/v1/users/:id", (request, response) => {
  console.log("Params =>", request.params);
  console.log("Body =>", request.body);

  const updated = User.findOneAndUpdate(
    { _id: request.params.id },
    { $push: { cards: request.body.card } },
    { new: true },
    (error, doc) => {
      if (error) {
        return response.status(422).json({ error: error });
      }
      return response.status(200).json({ success: true, data: doc });
    }
  );
});
// Delete a card from a user's collection
router.put("/api/v1/users/cards/delete/:id", (request, response) => {
  console.log("Params =>", request.params);
  console.log("Body =>", request.body);
  const updated = User.findOneAndUpdate(
    { _id: request.params.id },
    { $pull: { cards: { id: request.body.card.id } } },
    { new: true },
    (error, doc) => {
      if (error) {
        return response.status(422).json({ error: error });
      }
      return response.status(200).json({ success: true, data: doc });
    }
  );
});
// Find a User in the DB
router.get("/api/v1/users/:id", async (request, response) => {
  console.log("Params =>", request.params);
  try {
    const user = await User.findOne({ _id: request.params.id });
    if (!user) {
      return response
        .status(400)
        .json({ success: false, message: "no user found" });
    }
    response.status(200).json({ success: true, data: user.cards });
  } catch (err) {
    return response.status(500).json({ success: false, error: err.message });
  }
});

// Find a card in the DB
router.get("/api/v1/cards/:item", async (request, response) => {
  try {
    const cards = await loadCardsCollection();
    const card = await cards.findOne({ id: request.params.item });
    if (!card) {
      return response
        .status(422)
        .juston({ success: false, error: "Some Error" });
    }

    response.status(200).json({ success: true, data: card });
  } catch (err) {
    return response.status(500).json({ success: false, error: err.message });
  }
});

// Search for cards in the DB
router.get("/api/v1/query", async (request, response) => {
  try {
    const cards = await loadCardsCollection();

    const {
      name,
      set,
      cmc,
      typeLine,
      oracleText,
      colorIdentity
    } = request.query;
    let queryObj = {};
    if (name !== "") {
      queryObj["name"] = { $regex: `.*${name}.*`, $options: "i" };
    }
    if (set !== "") {
      queryObj["set"] = { $regex: `.*${set}.*`, $options: "i" };
    }
    if (cmc !== "") {
      queryObj["cmc"] = parseInt(cmc);
    }
    if (typeLine !== "") {
      queryObj["type_line"] = { $regex: `.*${typeLine}.*`, $options: "i" };
    }
    if (oracleText !== "") {
      queryObj["oracle_text"] = { $regex: `.*${oracleText}.*`, $options: "i" };
    }
    if (colorIdentity !== "") {
      queryObj["color_identity"] = {
        $regex: `.*${colorIdentity}.*`,
        $options: "i"
      };
    }

    const queryResult = await cards
      .find({
        $and: [
          { name: queryObj["name"] },
          { set: queryObj["set"] },
          { cmc: queryObj["cmc"] },
          { type_line: queryObj["type_line"] },
          { color_identity: queryObj["color_identity"] },
          { oracle_text: queryObj["oracle_text"] }
        ]
      })
      .collation({ locale: "en", strength: 1 })

      .toArray();

    if (!queryResult) {
      return response.status(400).json({ success: false, error: "Some Error" });
    }

    response.status(200).json({ success: true, data: queryResult });
  } catch (err) {
    return response.status(422).send({ Error: err.message });
  }
});

async function loadCardsCollection() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://admin:admin1234@cluster0-dposj.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ignoreUndefined: true
    }
  );
  return client.db("mtgcards").collection("data");
}

module.exports = router;
