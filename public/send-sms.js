// Twilio Credentials
const accountSid = 'ACcbbef196f70fb099577e2b5f38f13e3d';
const authToken = '666f9623eab885869eca5897e1e24a79';

// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
	    to: '+12035121641',
		from: '+16172092030',
		body: 'This is our pizza app',
		})
    .then((message) => console.log(message.sid));