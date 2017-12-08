const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);

app.get('/', function(req, res){
	res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});


