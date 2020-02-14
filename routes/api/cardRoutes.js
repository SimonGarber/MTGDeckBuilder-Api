const express = require("express");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const User = mongoose.model("User");
const router = express.Router();

// Add a card to a user's collection
router.put("/api/v1/users/:id", (request, response) => {
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

// List of User Cards
// Multistage Aggregation Pipeline Matching the userId from req.query
// then checking to see if cards are an array.
// The returned object is the userId, the cards array and the number of cards in the array
router.get("/api/v1/usercards", async (req, res) => {
	try {
		const userId = req.query.userId;
		const ObjectId = mongoose.Types.ObjectId;
		const Users = await loadUsersCollection();
		const user = await Users.aggregate([
			{
				$match: {
					_id: ObjectId(userId)
				}
			},
			{
				$project: {
					cards: 1,
					numberOfCards: {
						$cond: {
							if: { $isArray: "$cards" },
							then: { $size: "$cards" },
							else: "N/A"
						}
					}
				}
			}
		]).toArray();
		const results = user;
		res.status(200).json({ success: true, data: results });
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
});

// Display a single card from the DB
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

// Query cards in the DB
router.post("/api/v1/query", async (request, response) => {
	console.log(request.body);
	try {
		const cards = await loadCardsCollection();
		const {
			cardName,
			setName,
			cmc,
			typeLine,
			oracleText,
			colorId,
			colors
		} = request.body;
		const queryArray = [];

		if (cardName !== "") {
			queryArray.push({ name: { $regex: `.*${cardName}.*`, $options: "i" } });
		}
		if (setName !== "") {
			queryArray.push({
				set_name: { $regex: `.*${setName}.*`, $options: "i" }
			});
		}
		if (cmc !== "") {
			queryArray.push({ cmc: parseInt(cmc) });
		}
		if (typeLine !== "") {
			queryArray.push({
				type_line: { $regex: `.*${typeLine}.*`, $options: "i" }
			});
		}
		if (oracleText !== "") {
			queryArray.push({
				oracle_text: { $regex: `.*${oracleText}.*`, $options: "i" }
			});
		}
		if (colorId !== "") {
			queryArray.push({
				color_identity: {
					$regex: `.*${colorId}.*`,
					$options: "i"
				}
			});
		}
		if (colors.length > 0) {
			queryArray.push({ colors: { $all: colors } });
		}

		const queryResult = await cards
			.find({
				$and: queryArray
				// { name: queryObj["name"] },
				// { set_name: queryObj["set_name"] },
				// { cmc: queryObj["cmc"] },
				// { type_line: queryObj["type_line"] },
				// { color_identity: queryObj["color_identity"] },
				// { oracle_text: queryObj["oracle_text"] },
				// { colors: { $all: queryObj["colors"] } }
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

async function loadUsersCollection() {
	const client = await mongodb.MongoClient.connect(
		"mongodb+srv://admin:admin1234@cluster0-dposj.mongodb.net/test?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			ignoreUndefined: true
		}
	);
	return client.db("test").collection("users");
}
const loadCardsCollection = async () => {
	const client = await mongodb.MongoClient.connect(
		"mongodb+srv://admin:admin1234@cluster0-dposj.mongodb.net/test?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			ignoreUndefined: true
		}
	);
	return client.db("mtgcards").collection("data2");
};

module.exports = router;
