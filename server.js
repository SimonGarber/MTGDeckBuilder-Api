const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3001;
const app = express();
const db = require("./queries");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// Root
app.get("/", (request, response) => {
  response.json({ info: "node.js, express, mongodb" });
});
app.get("/api/users", db.getUser);
app.get("/api/cards/", db.getCards);
app.post(`/api/users/${userId}`, db.saveCard);

app.listen(port, () => console.log("listening on port", port));
