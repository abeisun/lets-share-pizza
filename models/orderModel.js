const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const order = new Schema({
    numSlices: int,
    pizzaShop: String,
    topping: String,
    contacts: [ { name: String, phoneNumber: String } ],
    createdAt: { type: Date, expires: 3600 },
}
