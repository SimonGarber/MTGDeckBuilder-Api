require("./users");
const express = require("express");
const morgan = require("morgan");
const colors = require("colors");

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const port = process.env.PORT || 5000;
const connectDB = require("./db");
const cardRoutes = require("./routes/api/cardRoutes");
const authRoutes = require("./routes/api/authRoutes");
const requireAuth = require("./requireAuth");
const app = express();

app.use(express.json());
app.use(
  morgan("dev", (tokens, req, res) => {
    [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens[`response-time`](req, res),
      "ms"
    ].join(" ");
  })
);

app.use(cors());
app.use(cookieParser());

app.use(cardRoutes);
app.use(authRoutes);
app.use("/api/v1/usercards", cardRoutes);
app.use("/api/v1/users", cardRoutes, authRoutes);
app.use("/api/v1/cards", cardRoutes);
app.use("/api/v1/query", cardRoutes);
app.use("/api/v1/users/cards", cardRoutes);

connectDB();

mongoose.connection.on("connected", () => {
  console.log(
    `Connected to Mongo Instance at => ${mongoose.connection.host.yellow.bold}`
      .magenta.bold
  );
});
mongoose.connection.on("error", err => {
  console.error("Error connecting to Mongo", err.red.bold);
});
app.get("/", requireAuth, (request, response) => {
  response.send(`Your Email: ${request.user.email}`);
});
app.get("/dashboard", requireAuth, (request, response) => {
  response.send(`Your Email: ${request.user.email}`);
});

app.listen(port, () =>
  console.log(`Express Server listening on port, ${port}`.cyan.bold.underline)
);
