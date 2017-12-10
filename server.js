const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);

app.use(express.static(__dirname + "/public"));   //serve css and javascript along side html pages
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('share-pizza is running on port', app.get('port'));
});

const mongoose = require('mongoose');
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/orders';

mongoose.connect(mongoUri, {
    useMongoClient: true
});

var orderModel = require('./models/orderModel.js');

app.get('/', function(req, res) {
	res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

app.post('/startOrder', function(req, res) {
    var order = new orderModel({
        numSlices: req.body.numSlices,
        pizzaShopName: req.body.pizzaShopName,
        toppings: req.body.toppings,
        contactInfo: req.body.contactInfo,
        coordinates: req.body.coordinates
    });

    order.save(function (err, order) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error when creating order",
                error: err
            });
        }
        return res.status(201).json(order);
    });
});

app.get('/allOrders.json', function(req, res) {
    orderModel.find({}, '_id numSlices pizzaShopName toppings coordinates createdAt', function(err, orders) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'error when getting all orders',
                error: err
            });
        }
        return res.json(orders);
    });
});

app.post('/addToOrder', function(req, res) {
    var objID = req.body.objID;
    orderModel.findById(objID, function (err, order) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'error when locating order',
                error: err
            });
        }
        order.size = order.size + req.body.numSlices;
        if (order.size > 8) {
            return res.status(400).json({
                message: 'too many slices (8 slices max)'
            });
        }
        orders.contacts.push(req.body.contact);
        order.save(function(err, updatedOrder) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'error when updating order',
                    error: err
                });
            }
        return res.json(updatedOrder);
        });
    });
});
