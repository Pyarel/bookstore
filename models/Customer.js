const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, unique: true, required: true },
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
