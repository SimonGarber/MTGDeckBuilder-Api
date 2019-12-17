const mongodb = require("mongodb");

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
    // Query that checks if the Array of color identities contains the value passed in the form
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
    "mongodb+srv://admin:mosHk2uBekny8wew@cluster0-dposj.mongodb.net/test?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      ignoreUndefined: true
    }
  );
  return client.db("mtgcards").collection("data");
}

module.exports = {
  getCards
};
