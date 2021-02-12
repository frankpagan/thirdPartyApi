
'use strict'
const axios = require("axios").default;
const Twitter = require("twit");


const utils = require('../utils');

// const consumer_key =  'hOugAN32rGsFldgxqYyJIJDTH';
// const consumer_secret =  'OSoVFrQxSk25OioMQZt77X7JOp95RE3HEVYh8pmnGpCgOa1rW1';
// const access_token =  '1314075796005253120-cSjwbxAOskNJWWBNla1hZwDzJu1oNU';
// const access_token_secret = 'iBzFp3hqGIdEzZNaYtsZTXoXWNyoOHvihT2ns43mTJpIk';
// const bearer_token = 'AAAAAAAAAAAAAAAAAAAAAMTWIQEAAAAATRpXMf%2Bugq2MynRAd9McR2JIap8%3DnfJMaMpiCenN6OlmJstmCaWI7NCiO0oSrwePRaLDZUBXNM2lrj';
// const client = new Twitter({ consumer_key, consumer_secret, access_token,  access_token_secret  });

let client;


class CoCreateDataTwitter {
    constructor(wsManager) {
        this.wsManager = wsManager;
        this.module_id = "twitter";
        this.init();
    }

    init() {
        if (this.wsManager) {
            this.wsManager.on(this.module_id, (socket, data) => this.twitterOprations(socket, data));
        }
    }

    async twitterOprations(socket, data) {
        const type = data['type'];
        const params = data['data'];

        try {

            const { consumer_key, consumer_secret, access_token, access_token_secret } = params;
            client = new Twitter({ consumer_key, consumer_secret, access_token, access_token_secret });

            switch (type) {

                case 'getFollowersList':
                    this.getFollowersList(socket, type, params);
                    break;

                case 'getUsersShow':
                    this.getUsersShow(socket, type, params);
                    break;

                case 'getSearchUser':
                    this.getSearchUser(socket, type, params);
                    break;

                case 'getFriendsList':
                    this.getFriendsList(socket, type, params);
                    break;

                case 'getSearchTweets':
                    this.getSearchTweets(socket, type, params);
                    break;

                case 'getUserslookup':
                    this.getUserslookup(socket, type, params);
                    break;

                case 'getUserTimeline':
                    this.getUserTimeline(socket, type, params);
                    break;

                case 'getTrendsPlace':
                    this.getTrendsPlace(socket, type, params);
                    break;

                case 'postTweet':
                    this.postTweet(socket, type, params);
                    break;
                    
                case 'getOauth2Token':
                    this.getOauth2Token(socket, type, params);
                    break;
            }
        } catch (error) {
            this.handleError(socket, type, error)
        }

    }

    async getFollowersList(socket, type, params) {
        try {
            const { screen_name } = params;

            const { data: results } = await client.get("followers/list", { // cursor: 1,
                screen_name,
                skip_status: true,
                include_user_entities: "flase"
            });
            const response = {
                'object': 'list',
                'data': results.users,
            };

            utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
        } catch (error) {
            this.handleError(socket, type, error)
        }
    }

    async getUsersShow(socket, type, params) {
        try {
            const { screen_name, user_id } = params

            const { data: results } = await client.get("users/show", { screen_name, user_id });
            const response = {
                'object': 'list',
                'data': results,
            };

            utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
        } catch (error) {
            this.handleError(socket, type, error)
        }
    }

    async getSearchUser(socket, type, params) {
        try {
            const { query: q } = params;

            const { data: results } = await client.get("users/search", { q });
            const response = {
                'object': 'list',
                'data': results,
            };

            utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
        } catch (error) {
            this.handleError(socket, type, error)
        }
    }

    async getFriendsList(socket, type, params) {
        try {
            const { screen_name } = params;

            const { data: results } = await client.get("friends/list", { screen_name });
            const response = {
                'object': 'list',
                'data': results.users,
            };

            utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
        } catch (error) {
            this.handleError(socket, type, error)
        }
    }



    async getSearchTweets(socket, type, params) {
        try {
            const { query: q } = params;

            const { data: results } = await client.get("search/tweets", { q });
            const response = {
                'object': 'list',
                'data': results.statuses,
            };

            utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
        } catch (error) {
            this.handleError(socket, type, error)
        }
    }

    async getUserslookup(socket, type, params) {
        try {
            const { screen_name, user_id } = params;

            const { data: results } = await client.get("users/lookup", { screen_name, user_id });
            const response = {
                'object': 'list',
                'data': results,
            };

            utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
        } catch (error) {
            this.handleError(socket, type, error)
        }
    }

    async getUserTimeline(socket, type, params) {
        try {
            const { screen_name, user_id } = params;

            const { data: results } = await client.get("statuses/user_timeline", { screen_name, user_id });
            const response = {
                'object': 'list',
                'data': results,
            };

            utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
        } catch (error) {
            this.handleError(socket, type, error)
        }

    }

    async getTrendsPlace(socket, type, params) {
        try {
            const { id } = params;

            const { data: results } = await client.get("trends/place", { id });
            const response = {
                'object': 'list',
                'data': results,
            };

            utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
        } catch (error) {
            this.handleError(socket, type, error)
        }
    }


    async postTweet(socket, type, params) {
        try {
            const { status } = params;
            const { data: results } = await client.post("statuses/update", { status });
            const response = {
                'object': 'list',
                'data': results,
            };

            utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);

        } catch (error) {
            this.handleError(socket, type, error)
        }

    }

    async getOauth2Token(socket, type, params) {
        try {
              const { consumer_key, consumer_secret } = params;
            
              const oauth2TokenURL = "https://api.twitter.com/oauth2/token";
              const b64Credentials = Buffer.from( consumer_key + ":" + consumer_secret).toString("base64"); 
              
              const { data : results } = await axios.post(
                oauth2TokenURL,
                "grant_type=client_credentials",
                {
                  headers: {
                    Authorization: "Basic " + b64Credentials,
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                  }
                }
              );
              
              const response = {
                'object': 'list',
                'data': results,
            };
            
            utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);

        } catch (error) {
            this.handleError(socket, type, error)
        }

    }
    
    handleError(socket, type, error) {
        const response = {
            'object': 'error',
            'data': error.message || error,
        };
        utils.send_response(this.wsManager, socket, { type, response }, this.module_id);
    }

}//end Class 

module.exports = CoCreateDataTwitter;









/*


Twitter OAuth steps:-

1] Post a http request_token with your consumer_key,consumer_secret.

Description: - in backend create function getrequesttoken and implement below logic

URL:- POST https://api.twitter.com/oauth/request_token

Authorization:- Header: 
{ "Authorization" : OAuth oauth_consumer_key="P1x3XgD3ZAn5eUTm95iyhybxb",oauth_signature_method="HMAC-      SHA1",oauth_timestamp="1602673867",oauth_nonce="iDzXdsu4oFH",oauth_version="1.0",oauth_signature="z9oov2L2W9xqA3rApfs7dmxNHE0%3D
}

Response:- oauth_token=Z6eEdO8MOmk394WozF5oKyuAv855l4Mlqo7hhlSLik&oauth_token_secret=Kd75W4OQfb2oJTV0vzGzeXftVAwgMnEK9MumzYcM&oauth_callback_confirmed=true

2] after getting oauth_token from step1 than navigate to user twitter login.

Description: - in fronted get token from step1 and implement below logic

Logic :- window.location.href = 'https://api.twitter.com/oauth/authorize?oauth_token=0B0LeAAAAAABIuAwAAABdSa66r4';

3] implement CallBackURL and get the response token form loged user.

Note:-  In twitter Developer Portal enable Authentication settings and added CallBackURL.
Description: - so when callback URL hit by twitter Site than in fronted implement below logic.

Logic :- function getResponseOauth_token() {
	const urlParams1 = new URLSearchParams(window.location.search);
	const oauth_token = urlParams1.get('oauth_token');
	const oauth_verifier = urlParams1.get('oauth_verifier');


	const xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);		// response oauth_token and oauth_token_secret
			// Example response oauth_token=6253282-eWudHldSbIaelX7swmsiHImEL4KinwaGloHANdrY&oauth_token_secret=2EEfA6BG5ly3sR3XjE0IBSnlQu4ZrUzPiYTmrkVU&user_id=6253282&screen_name=twitterapi
		}
	};

	//POST https://api.twitter.com/oauth/access_token?oauth_token=qLBVyoAAAAAAx72QAAATZxQWU6P&oauth_verifier=ghLM8lYmAxDbaqL912RZSRjCCEXKDIzx
	xhttp.open("POST", "https://api.twitter.com/oauth/access_token", true);	
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(`oauth_token=${oauth_token}&oauth_verifier=${oauth_verifier}`);
}

*/