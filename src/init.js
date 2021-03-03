
// const CoCreateXXX = require('./plugins/xxx/CoCreate-xxx')
const CoCreateFacebook = require('./plugins/facebook/CoCreate-facebook');
const CoCreateDataLinkedin = require('./plugins/linkedin/CoCreate-linkedin');
const CoCreateTwitter = require('./plugins/twitter/CoCreate-twitter');
const CoCreateDataPlaid = require('./plugins/plaid/CoCreate-plaid');
const CoCreateGoogleAuth = require('./plugins/googleauth/CoCreate-googleauth');
const CoCreateDataShipengine = require('./plugins/shipengine/CoCreate-shipengine');
const CoCreateDataInstagram = require('./plugins/instagram/CoCreate-instagram');
const CoCreateLightHouse = require('./plugins/lighthouse/CoCreate-lighthouse');
const CoCreateXXX = require('./plugins/xxx/CoCreate-xxx');


module.exports.WSManager = function(manager) {
	// new CoCreateXXX(manager)
	new CoCreateDataLinkedin(manager)
	new CoCreateTwitter(manager);
	new CoCreateDataPlaid(manager);
	new CoCreateGoogleAuth(manager);
	new CoCreateFacebook(manager);
	new CoCreateDataShipengine(manager);
	new CoCreateDataInstagram(manager);
	new CoCreateLightHouse(manager);
	new CoCreateXXX(manager);
}

