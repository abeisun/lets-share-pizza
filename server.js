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
    orderModel.findByIdAndUpdate(req.body.objID, 
        { $inc: { 'numSlices': req.body.numSlices },
          $push: { 'contactInfo': req.body.contact } }, 
        function (err, updatedOrder) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'error when updating order',
                    error: err
                });
            }
            // textContact(updatedOrder);
            orderModel.remove({'numSlices': 8}, function(err) {
                if (err) {
                    console.log(err);
                }
            });
            return res.json(updatedOrder);
        });
});

const twilioClient = require('./private/twilioClient.js');

function textContact(order) {
    var textBody = "";
    if (order.numSlices == 8) {
        textBody += "Congratulations on finishing the pizza order!\n";
    }
    textBody += "Pizza Shop: " + order.pizzaShopName + "\nNumber of slices so far: " + order.numSlices + "\nToppings: " + order.toppings + '\n';
    var contacts = order.contactInfo;
    var numContacts = contacts.length;
    
    //populate the text body with contact info
    for (var i = 0; i < numContacts; ++i) {
        textBody += "Person " + (i+1) + ": " + contacts[i].name + "\nPhone #: " + contacts[i].phoneNumber + '\n';
    }

    //send SMS to each contact
    for (var i = 0; i < numContacts; ++i) {
        twilioClient.messages.create({
            to: contacts[i].phoneNumber,
            from: '+16172092030',
            body: textBody
        }).then((message) => console.log(message.sid));
    }
}
