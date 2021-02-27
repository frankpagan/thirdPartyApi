
// const CoCreateXXX = require('./apis/xxx/CoCreate-xxx')
const CoCreateDataStripe = require('./apis/stripe/CoCreate-stripe');
const CoCreateFacebook = require('./apis/facebook/CoCreate-facebook');
const CoCreateDataLinkedin = require('./apis/linkedin/CoCreate-linkedin');
const CoCreateTwilio = require('./apis/twilio/CoCreate-twilio');
const CoCreateTwitter = require('./apis/twitter/CoCreate-twitter');
const CoCreateDataPlaid = require('./apis/plaid/CoCreate-plaid');
const CoCreateSendGrid = require('./apis/sendgrid/CoCreate-sendgrid'); 
const CoCreateGoogleAuth = require('./apis/googleauth/CoCreate-googleauth');
const CoCreateDataShipengine = require('./apis/shipengine/CoCreate-shipengine');
const CoCreateDataInstagram = require('./apis/instagram/CoCreate-instagram');
const CoCreateLightHouse = require('./apis/lighthouse/CoCreate-lighthouse');


module.exports.WSManager = function(manager) {
	// new CoCreateXXX(manager)
	new CoCreateDataStripe(manager)
	new CoCreateDataLinkedin(manager)
	new CoCreateTwilio(manager)
	new CoCreateTwitter(manager);
	new CoCreateDataPlaid(manager);
	new CoCreateSendGrid(manager);
	new CoCreateGoogleAuth(manager);
	new CoCreateFacebook(manager);
	new CoCreateDataShipengine(manager);
	new CoCreateDataInstagram(manager);
	new CoCreateLightHouse(manager);
}

