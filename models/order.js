// Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    address: String,
    items: [String], // Store the items as an array of strings for simplicity
    // You can add more fields as needed
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
