const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  const r = users.filter(u => u.username === username)
  return r.length > 0;
}

public_users.post("/register", (req, res) => {
  const { username } = req.body;
  const { password } = req.body;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username, password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json({ ...books });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;
  return res.status(200).json({ ...books[isbn] });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;
  const booksByAuthor = Object.values(books).filter((b) => b.author === author);

  return res.status(200).json({ ...booksByAuthor });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;
  const booksByTitle = Object.values(books).filter((b) => b.title === title);
  return res.status(200).json({ ...booksByTitle });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  return res.status(200).json({ ...books[isbn]?.reviews });
});

module.exports.general = public_users;
