const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').Server(app);

app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res){
	res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

http.listen(process.env.PORT || 3000, function() {
  	console.log('share-pizza is running on port 3000');
});
