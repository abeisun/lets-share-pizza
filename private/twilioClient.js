// Twilio Credentials
const accountSid = 'ACcbbef196f70fb099577e2b5f38f13e3d';
const authToken = '666f9623eab885869eca5897e1e24a79';

// require the Twilio module and create a REST client
const twilioClient = require('twilio')(accountSid, authToken);
module.exports = twilioClient;
