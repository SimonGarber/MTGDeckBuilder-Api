const mongodb = require("mongodb");

const getCards = async (request, response) => {
  const cards = await loadCardsCollection();

  const { name, set, cmc, typeLine, oracleText, colorIdentity } = request.query;
  const queryObj = {};
  if (name !== "") {
    queryObj["name"] = { $regex: `.*${name}.*` };
  }
  if (set !== "") {
    queryObj["set"] = `${set}`;
  }
  if (cmc !== "") {
    queryObj["cmc"] = parseInt(cmc);
  }
  if (typeLine !== "") {
    queryObj["type_line"] = { $regex: `.*${typeLine}.*` };
  }
  if (oracleText !== "") {
    queryObj["oracle_text"] = { $regex: `.*${oracleText}.*` };
  }
  // Query that checks if the Array of color identities contains the value passed in the form
  if (colorIdentity !== "") {
    queryObj["color_identity"] = `${colorIdentity}`;
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
      "mongodb+srv://admin:Dpb56MGY?8+ly11@cluster0-dposj.mongodb.net/test?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        ignoreUndefined: true
      }
    );
    return client.db("mtgcards").collection("data");
  }
};

module.exports = {
  getCards
};
