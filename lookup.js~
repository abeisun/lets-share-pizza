const accountSid = 'ACcbbef196f70fb099577e2b5f38f13e3d';
const authToken = '666f9623eab885869eca5897e1e24a79';
const LookupsClient = require('twilio').LookupsClient;
const client = new LookupsClient(accountSid, authToken);
 
client.phoneNumbers('+12035121641').get((error, number) => {
	console.log(number.national_format);
	console.log(number.country_code);
  
	// This will sometimes be null
	console.log(number.caller_name);
});