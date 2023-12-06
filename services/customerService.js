const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");

//Create a customer and save in database
const createCustomer = async function (username, password) {
  const hashPassword = await bcrypt.hash(password, 10);
  const customer = new Customer({
    username,
    password: hashPassword,
  });
  return customer.save();
};

const getCustomerById = async function (id) {
  return Customer.findById(id);
};

const getCustomerByUserName = async function (username) {
  return Customer.findOne({ username });
};

module.exports = {
  createCustomer,
  getCustomerById,
  getCustomerByUserName,
};
