require("./users");
const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT || 3001;
const connectDB = require("./db");
const cardRoutes = require("./routes/api/cardRoutes");
const authRoutes = require("./routes/api/authRoutes");
const requireAuth = require("./requireAuth");
const app = express();

app.use(express.json());
app.use(cardRoutes);
app.use(authRoutes);
app.use("/api/v1/users", cardRoutes, authRoutes);
app.use("/api/v1/cards", cardRoutes);
app.use("/api/v1/query", cardRoutes);
app.use("/api/v1/users/cards", cardRoutes);
connectDB();

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo Instance");
});
mongoose.connection.on("error", err => {
  console.error("Error connecting to Mongo", err);
});
app.get("/", requireAuth, (request, response) => {
  response.send(`Your Email: ${request.user.email}`);
});

app.listen(port, () => console.log("listening on port", port));
