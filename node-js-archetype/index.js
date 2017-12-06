var express = require('express');
const path = require('path')

var app = express();

var bodyParser = require('body-parser');


/* bodyParser setup */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/* Mongo setup stuff */
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost/";
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
    db = databaseConnection;
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.join(__dirname, 'pages')));


app.get('/', function(request, response) {

    response.sendFile(__dirname + './index.html');

});


app.post('/requestSlice', function(request, response) {


});

app.post('/startOrder', function(request, response) {
    /* Write code here that will process the post request sent by the startOrder form */
    console.log(request.body);
    /* 
     * The request comes in as JSON with this format:
     * 
     * {
     *      num_slices: ---,
     *      contact-info: ---,
     *      type_of: ---.
     *      shop: ---
     * }
     *
     */
    response.send("Received this");

    /* This is exclusively database stuff now */

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
