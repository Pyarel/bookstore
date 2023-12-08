const Book = require("../models/Book");

// To get all book details
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    //For debugging console.log(books);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// To search book  by title, author or genre
const searchBooks = async (req, res) => {
  const { criteria } = req.query;
  const regex = new RegExp(criteria, "i");
  //For debugging console.log(criteria);
  try {
    let query;

    // Search by title
    query = { title: { $regex: regex } };
    let books = await Book.find(query);

    // For debugging: console.log(books);
    if (books.length === 0) {
      // If no results found, search by author
      query = { author: { $regex: regex } };
      books = await Book.find(query);
    }

    if (books.length === 0) {
      // If still no results found, search by genre
      query = { genre: { $regex: regex } };
      books = await Book.find(query);
    }

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// To Create new book
const createBook = async (req, res) => {
  //For debugging console.log("req.body: ", req.body);
  const { title, author, genre, quantity, price } = req.body;
  try {
    const newBook = new Book({ title, author, genre, quantity, price });
    const savedBook = await newBook.save();
    console.log("Saved Book: ", savedBook);
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// To Update Existing book
const updateBook = async (req, res) => {
  console.log("req.param:", req.params);
  console.log("req.body:", req.body);
  const { id } = req.params;
  const { quantity, price } = req.body;
  console.log(req.body);
  try {
    const existingBook = await Book.findById(id);
    console.log("existing book:", existingBook);
    existingBook.quantity =
      quantity !== undefined ? quantity : existingBook.quantity;
    existingBook.price = price !== undefined ? price : existingBook.price;

    const updatedBook = await existingBook.save();
    console.log("Updated Book:", updatedBook);
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// To Delete existing book
const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllBooks,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
};
