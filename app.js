const express = require("express");
const mongoose = require("mongoose");
const customerRoutes = require("./routes/customerRoutes");
const path = require("path");
const cors = require("cors");
const bookRoutes = require("./routes/bookRoutes");
const jwt = require("jsonwebtoken");
const app = express();
const Order = require("./models/order");
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

app.get("/cart", (req, res) => {
  res.sendFile(__dirname + "/views/cart.html");
});
app.post("/place-order", async (req, res) => {
  const { name, mobile, address, items } = req.body; // Retrieve order details from the request
  try {
    // Create a new order instance using the Order model
    const newOrder = new Order({
      name,
      mobile,
      address,
      items,
    });
    // Save the new order to the database
    const savedOrder = await newOrder.save();
    console.log("Order saved:", savedOrder);

    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});
// Middleware for extracting and verifying the token
const authenticateToken = (req, res, next) => {
  const token = req.query.token.slice(7);
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }
  jwt.verify(token, "Lambton@23", (err) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    next();
  });
};

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
