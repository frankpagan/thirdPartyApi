
const CoCreateDomain = require('./plugins/domain/CoCreate-domain');
const CoCreateEmail = require('./plugins/email/CoCreate-email');
const CoCreateFacebook = require('./plugins/facebook/CoCreate-facebook');
const CoCreateGoogleAuth = require('./plugins/googleauth/CoCreate-googleauth');
const CoCreateInstagram = require('./plugins/instagram/CoCreate-instagram');
const CoCreateLightHouse = require('./plugins/lighthouse/CoCreate-lighthouse');
const CoCreateLinkedin = require('./plugins/linkedin/CoCreate-linkedin');
const CoCreatePlaid = require('./plugins/plaid/CoCreate-plaid');
const CoCreateSendGrid = require('./plugins/sendgrid/CoCreate-sendgrid'); 
const CoCreateShipengine = require('./plugins/shipengine/CoCreate-shipengine');
const CoCreateStripe = require('./plugins/stripe/CoCreate-stripe');
const CoCreateTwilio = require('./plugins/twilio/CoCreate-twilio');
const CoCreateTwitter = require('./plugins/twitter/CoCreate-twitter');
const CoCreateXXX = require('./plugins/xxx/CoCreate-xxx');


module.exports.WSManager = function(manager) {
	new CoCreateDomain(manager);
	new CoCreateEmail(manager);
	new CoCreateFacebook(manager);
	new CoCreateGoogleAuth(manager);
	new CoCreateInstagram(manager);
	new CoCreateLightHouse(manager);
	new CoCreateLinkedin(manager)
	new CoCreatePlaid(manager);
	new CoCreateSendGrid(manager);
	new CoCreateShipengine(manager);
	new CoCreateStripe(manager);
	new CoCreateTwilio(manager);
	new CoCreateTwitter(manager);
	new CoCreateXXX(manager);

}