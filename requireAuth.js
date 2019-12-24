const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: "you must be logged in" });
  }

  let token = authorization;
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, "My_SECRET_KEY", async (err, payload) => {
      if (err) {
        return res.status(401).send({ error: "you must be logged in" });
      }
      const { userId } = payload;

      const user = await User.findById(userId);
      req.user = user;
      next();
    });
  }
};
