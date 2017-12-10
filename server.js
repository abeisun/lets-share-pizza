const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


const app = express();
const http = require('http').Server(app);

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('share-pizza is running on port', app.get('port'));
});

const mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/pizza';

mongoose.connect(mongoDB, {
    useMongoClient: true
});

app.get('/', function(req, res){
	res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

app.post('/newRequest', function(req, res){
    var numSlices = req.body.
    res.send();
});

