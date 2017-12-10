const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    numSlices: { type: Number, min: 0, max: 8 },
    pizzaShopName: String,
    // toppings: String,
    // contactInfo: [{ name: String, phoneNumber: String }],
    // coordinates: [{ type: Number }],
    createdAt: { type: Date, default: Date.now, expires: 7200 }
});

module.exports = mongoose.model('orders', orderSchema);
