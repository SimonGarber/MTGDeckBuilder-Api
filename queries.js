const mongodb = require("mongodb");
const express = require("express");
const User = require("./users");
const connectDB = require("./db");
// Save card to user collection

const saveCard = async (request, response) => {};

// Get user from DB

const getUser = async (request, response) => {
  connectDB();
  const { id } = request.params;
  console.log(id);
  try {
    const user = await User.findOne({ _id: id });
    if (!user) {
      response.status(400).json({ success: false });
    }
    response.status(200).json({ success: true, data: user });
  } catch (err) {
    return response.status(422).json({ success: false, error: err.message });
  }
};

const addUser = async (request, response) => {};
// Get cards from front end query
const getCards = async (request, response) => {
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

    response.send(
      await cards
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

        .toArray()
    );
  } catch (err) {
    response.status(422).send({ Error: err.message });
  }
};

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

// async function loadUsersCollection() {
//   const client = await mongodb.MongoClient.connect(
//     "mongodb+srv://admin:admin1234@cluster0-dposj.mongodb.net/test?retryWrites=true&w=majority",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       ignoreUndefined: true
//     }
//   );
//   return client.db("test").collection("users");
// }
module.exports = {
  getCards,
  saveCard,
  getUser
};
