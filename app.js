const express = require("express");
const mongoose = require("mongoose");
const customerRoutes = require("./routes/customerRoutes");
const path = require("path");
const cors = require("cors");
const passport = require("passport");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());

require("./config/passport");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get(
  "/protected",
  (req, res, next) => {
    console.log("Request to /protected route");
    next();
  },
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("User authenticated successfully");
  }
);

// Connecting to the bookstore database
mongoose.connect("mongodb://localhost:27017/bookstore", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes without a base path
app.use(customerRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
