const express = require("express");
const mongoose = require("mongoose");
const customerRoutes = require("./routes/customerRoutes");
const path = require("path");
const cors = require("cors");
const bookRoutes = require("./routes/bookRoutes");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.static("public")); // Serve static files from the "public" directory
app.use(express.json());
// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

// Example protected route that requires authentication
app.get("/books", (req, res) => {
  // Your logic for handling the /books route
  res.sendFile(path.join(__dirname, "views", "bookList.html"));
});

// Connecting to the bookstore database
mongoose.connect("mongodb://127.0.0.1:27017/BookStore", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes without a base path
app.use(customerRoutes);

// Use Book routes
app.use("/api", bookRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
