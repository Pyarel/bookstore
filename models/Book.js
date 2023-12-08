// Importing mongoose

const mongoose = require("mongoose");

// Creating Schema for Book
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  genre: { type: String },
  quantity: Number,
  price: Number,
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
