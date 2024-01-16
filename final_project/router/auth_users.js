const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "silvestre", password: "naranja"}];

const isValid = (username) => {
  const userMatches = users.filter((user) => username === user.username);
  return userMatches.length > 0;
};

const authenticatedUser = (username, password) => {
  const matchingUsers = users.filter(
    (user) => username === user.username && password === user.password
  );
  return matchingUsers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(401)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const { username } = req.session.authorization;

  if (books[isbn]) {
    const book = books[isbn];
    book.reviews[username] = review;
    return res.status(200).send("Review successfully posted");
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session.authorization;
  if (books[isbn]) {
    let book = books[isbn];
    delete book.reviews[username];
    return res.status(200).send("Review successfully deleted");
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
