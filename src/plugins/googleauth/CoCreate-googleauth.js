'use strict'
var utils= require('../../utils');
var http = require('http');
var passport = require('passport');

const {OAuth2Client} = require('google-auth-library');
const open = require('open');
const url = require('url');
const destroyer = require('server-destroy');
const { getOrg } = require("../../utils/crud.js");


class CoCreateDataGoogleAuth {
	constructor(wsManager) {
		this.module_id = 'googleauth';
		this.wsManager = wsManager;
		this.init();
		this.GOOGLE_CLIENT_ID=null;
		this.GOOGLE_CLIENT_SECRET=null;
		this.enviroment = 'test';
		
	}
	
	init() {
		if (this.wsManager) {
			this.wsManager.on(this.module_id,(socket, data) => this.GoogleAuthOperations(socket, data));
		}
	}
	async GoogleAuthOperations(socket, data) {
	    let that = this;
	    console.log("GoogleAuth")
        let type = data['type'];
        const params = data['data'];
        
        try{
      	       let enviroment = typeof params['enviroment'] != 'undefined' ? params['enviroment'] : this.enviroment;
               let org_row = await getOrg(params,this.module_id);
               this.GOOGLE_CLIENT_ID = org_row['apis.'+this.module_id+'.'+enviroment+'.GOOGLE_CLIENT_ID'];
               this.GOOGLE_CLIENT_SECRET = org_row['apis.'+this.module_id+'.'+enviroment+'.GOOGLE_CLIENT_SECRET'];
      	 }catch(e){
      	   	console.log(this.module_id+" : Error Connect to api",e)
      	   	return false;
      	 }
        
      
        switch (type) {
            case 'generateAuthURL':
                const oAuth2Client = await this.getAuthenticatedClient(that, socket, type);
                const url = 'https://people.googleapis.com/v1/people/me?personFields=names';
                const res = await oAuth2Client.request({url});
                utils.send_response(that.wsManager, socket, {"type":type,"response":res.data}, this.module_id)

                break;
        }
        
	}
	
	
	getAuthenticatedClient(that, socket, type) {
  return new Promise((resolve, reject) => {
    // create an oAuth client to authorize the API call.  Secrets are kept in a `keys.json` file,
    // which should be downloaded from the Google Developers Console.
    const oAuth2Client = new OAuth2Client(
      this.GOOGLE_CLIENT_ID,
      this.GOOGLE_CLIENT_SECRET,
      'http://52.203.210.252:3004/oauth2callback'
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
    });

    // Open an http server to accept the oauth callback. In this simple example, the
    // only request to our webserver is to /oauth2callback?code=<code>
    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            const qs = new url.URL(req.url, 'http://localhost:3004').searchParams;
            const code = qs.get('code');
            console.log(`Code is ${code}`);
            res.end('Authentication successful! Please return to the console.');
            server.destroy();

            // Now that we have the code, use that to acquire tokens.
            const r = await oAuth2Client.getToken(code);
            // Make sure to set the credentials on the OAuth2 client.
            oAuth2Client.setCredentials(r.tokens);
            console.info('Tokens acquired.');
            resolve(oAuth2Client);
            
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3004, () => {
          utils.send_response(that.wsManager, socket, {"type":type,"response":authorizeUrl}, this.module_id)
        // // open the browser to the authorize url to start the workflow
        // open(authorizeUrl, {wait: false}).then(cp => cp.unref());
      });
    destroyer(server);
  });
}

	
}//end Class 
module.exports = CoCreateDataGoogleAuth;
