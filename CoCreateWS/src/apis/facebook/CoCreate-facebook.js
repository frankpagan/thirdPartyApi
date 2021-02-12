'use strict'
const utils= require('../utils');

const { Facebook, FacebookApiException } = require("fb");

const APPID = "1804989386230604";
const appSecret = "e3ba23a03c4cc62cf693eced645e0137";
const FB = new Facebook();

class CoCreateDataFacebook {
	constructor(wsManager) {
		this.wsManager = wsManager;
		this.module_id = "facebook";
		this.init();
	}
	
	init() {
		if (this.wsManager) {
			this.wsManager.on(this.module_id, (socket, data) => this.sendFacebook(socket, data));
		}
	}

	async sendFacebook(socket, data) {	    
	    let type = data['type'];
	    const params = data['data'];
	    
	    try {
            switch (type) {
                case 'getUserProfile':
                    this.getUserProfile(socket, type, params);
                    break;

                case 'getUserFeed':
                    this.getUserFeed(socket, type, params);
                    break;
                    
                case 'postFeed':
                    this.postFeed(socket, type, params);
                    break;

                case 'deletePost':
                    this.deletePost(socket, type, params);
                    break;
            }

        } catch (error) {
            this.handleError(socket, type, error)
        }
	}
	

	async getUserProfile(socket, type, params) {
        try {
            const { accessToken } = params;
            FB.setAccessToken(accessToken);

			const resonseData =	await FB.api("me", {fields: ["id", "name", "email","about","address","birthday","gender","location"]});
            const response = {
                'object': 'list',
                'data': resonseData,
            };

            utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
        } catch (error) {
            this.handleError(socket, type, error)
        }
    }
    
    async postFeed(socket, type, params) {
        try {
            const { accessToken,message } = params;
            FB.setAccessToken(accessToken);
            const resonseData =	await FB.api('me/feed', 'post', { message})
            
            if(!resonseData || resonseData.error) {
                throw(resonseData.error || resonseData)
            }
             
            const response = {
                'object': 'list',
                'data': resonseData,
            };
            utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
        } catch (error) {
            this.handleError(socket, type, error)
        }
    }
    
    async deletePost(socket, type, params) {
        try {
            const { accessToken,message ,postId} = params;
            FB.setAccessToken(accessToken);
            
            const resonseData =	await FB.api(postId, 'delete', { message})
            
            if(!resonseData || resonseData.error) {
                throw(resonseData.error || resonseData)
            }
             
            const response = {
                'object': 'list',
                'data': resonseData,
            };
            utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
        } catch (error) {
            this.handleError(socket, type, error)
        }
    }
    
    async getUserFeed(socket, type, params){
        try {
            const { accessToken,message ,postId} = params;
            FB.setAccessToken(accessToken);
            
            const resonseData = await FB.api("/me/feed");

            if(!resonseData || resonseData.error) {
                throw(resonseData.error || resonseData)
            }
             
            const response = {
                'object': 'list',
                'data': resonseData,
            };
            utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
        } catch (error) {
            this.handleError(socket, type, error)
        }
    }
    
    handleError(socket, type, error) {
        const response = {
            'object': 'error',
            'data':   error.message || error,
        };
        utils.send_response(this.wsManager, socket, { type, response }, this.module_id);
    }
}//end Class 

module.exports = CoCreateDataFacebook;
