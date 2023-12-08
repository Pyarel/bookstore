const express = require("express");
const bookController = require("../controllers/bookController");
const passport = require("passport");
const router = express.Router();
// Use passport.authenticate as middleware for authentication
router.use("/books", passport.authenticate("jwt", { session: false }));
router.get("/books", bookController.getAllBooks);
router.get("/books/search", bookController.searchBooks);
router.get("/books", bookController.getAllBooks);
// router.get("/books/:id", bookController.getBookById);
router.post("/books", bookController.createBook);
router.put("/books/:id", bookController.updateBook);
router.delete("/books/:id", bookController.deleteBook);

module.exports = router;
