// const passport = require("passport");
const customerService = require("../services/customerService");
const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async function (req, res) {
  try {
    const { username, password } = req.body;
    // Create a new customer
    const customer = await customerService.createCustomer(username, password);
    res.status(200).json({ message: "Customer registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login
const loginUser = async function (req, res) {
  Customer.findOne({ username: req.body.username }).then((user) => {
    //No user found
    if (!user) {
      res.status(401).json({ message: "Could not find user in the database" });
    }
    //Check password
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    return res.status(200).json({
      message: "Welcome!",
      username: user.username,
    });
    // console.log(token);
  });
};

module.exports = { registerUser, loginUser };
