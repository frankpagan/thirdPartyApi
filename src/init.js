
const config = require('../CoCreate.config.js');

 const CoCreateDomain = require('@cocreate/domain');
// const CoCreateEmail = require('@cocreate/email');
// const CoCreateFacebook = require('@cocreate/facebook');
const CoCreateGoogleAuth = require('@cocreate/google-auth');
const CoCreateInstagram = require('@cocreate/instagram');
const CoCreateLightHouse = require('@cocreate/lighthouse');
const CoCreateLinkedin = require('@cocreate/linkedin');
const CoCreatePlaid = require('@cocreate/plaid');
const CoCreateSendGrid = require('@cocreate/sendgrid'); 
const CoCreatePinterest = require('@cocreate/pinterest'); 
const CoCreateShipengine = require('@cocreate/shipengine');
const CoCreateStripe = require('@cocreate/stripe');
// const CoCreateTwilio = require('@cocreate/twilio');
const CoCreateTwitter = require('@cocreate/twitter');
// const CoCreateXXX = require('@cocreate/xxx');
const ApiPermission = require("./permission.js")

module.exports.WSManager = function(manager) {
	 new CoCreatePinterest(manager);
	 new CoCreateDomain(manager);
	// new CoCreateEmail(manager);
	// new CoCreateFacebook(manager);
	new CoCreateGoogleAuth(manager);
	new CoCreateInstagram(manager);
	new CoCreateLightHouse(manager);
	new CoCreateLinkedin(manager)
	new CoCreatePlaid(manager);
	new CoCreateSendGrid(manager);
	new CoCreateShipengine(manager);
	new CoCreateStripe(manager);
	// new CoCreateTwilio(manager, config);
	new CoCreateTwitter(manager);
	// new CoCreateXXX(manager);
	const permission = new ApiPermission();
	manager.setPermission(permission)
}