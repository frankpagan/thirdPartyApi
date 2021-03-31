/* global Y */
'use strict'
var utils= require('../utils');
const connection = require('../../config/dbConnection.js');
var ObjectID = require('mongodb').ObjectID;
/*const CoCreateBase = require("../../core/CoCreateBase");

class CoCreateStripe extends CoCreateBase {
	constructor(wsManager, db) {
		super(wsManager, db);
		this.module_id = "stripe";
		this.init();
	}
*/
class CoCreateStripe {
	constructor(wsManager) {
		this.module_id = 'stripe';
		this.wsManager = wsManager;
		this.init();
		
	}
	
	init() {
		if (this.wsManager) {
		//	this.wsManager.on('stripe',		(socket, data) => this.sendStripe(socket, data));
		this.wsManager.on('stripe',		(socket, data, roomInfo) => this.sendTwilio(socket, data, roomInfo));
		}
	}
	async sendStripe(socket, data,roomInfo) {
	    let that = this;
	    let send_response ='stripe';
	    let data_original = {...data};
	    console.log("Stripe => ",data_original);
        let type = data['type'];
        delete data['type'];
        let url = '';
        let method = '';
        let targets = [];
        let tags = [];
        let key_stripe = 'sk_test_4eC39HqLyjWDarjtT1zdp7dc'
        console.log("type ",type)
        //const stripe = require('stripe')(key_stripe);    //// platform key
       // let charges =await stripe.charges.retrieve('ch_1HTyOl2eZvKYlo2CezyK5RPj');
        //const 
        let key_api = roomInfo.key;
        // org = await this._getKeysbyOrg(key_api);
        console.log("Get Org",org)
        
        const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
 
        ///key dinamic
        // 1 step Query to master Db
        // 2 step config socket
        // query collection org to get key
        // 
        /*
        const socket_config = {
		    "config": {
		        "apiKey": "c2b08663-06e3-440c-ef6f-13978b42883a",
		        "securityKey": "f26baf68-e3a9-45fc-effe-502e47116265",
		        "organization_Id": "5de0387b12e200ea63204d6c",
		    },
		    "prefix": "ws",
		    "host": "server.cocreate.app:8088"
		}
		ServerCrud.SocketInit(socket_config)
		*/
  
          
        /*Address*/
        
        switch (type) {
            case 'createCharge':
                this.createCharge(socket,type,data["data"],stripe);
            break;
            case 'createCustomer':
                this.createCustomer(socket,type,data["data"],stripe);
            break;
            case 'updateCustomer':
                this.updateCustomer(socket,type,data["data"],stripe);
            break;
            case 'createTokenCard':
                this.createTokenCard(socket,type,data["data"],stripe);
            break;
            case 'getBalance':
                // stripe = require('stripe')('sk_test_lWZQujOjyjfDq991GZjKmfli');                   //// use platform key
                stripe.balance.retrieve((err, balance) => {
                    if (!err && balance) {
                      utils.send_response(this.wsManager, socket, { "type": data_original["type"], "response": balance }, this.module_id)
                    } else if (err) {
                        utils.send_response(this.wsManager, socket, { "type": data_original["type"], "response": 0 }, this.module_id)
                    }
                  });
                break;
            case 'balanceTransaction':
                const balanceTransaction = await stripe.balanceTransactions.retrieve(
                  'txn_1032HU2eZvKYlo2CEPtcnUvl'
                );
                console.log(" REspuesta ",balanceTransaction)
                utils.send_response(this.wsManager, socket, { "type": data_original["type"], "response": balanceTransaction }, this.module_id)
            break;
            case 'createCustomer':
                const customer = await stripe.customers.create(data["data"]);
                //console.log(" REspuesta ",customer)
                utils.send_response(this.wsManager, socket, { "type": data_original["type"], "response": customer }, this.module_id)
            break;
            case 'createSourceCustomer':
                let id_customer = data['customer_id'];
                delete data['customer_id'];
                const card = await stripe.customers.createSource(
                  id_customer,
                  data["data"]
                );
                utils.send_response(this.wsManager, socket, { "type": data_original["type"], "response": card }, this.module_id)
            break;
            case 'listCustomers':
                const customers = await stripe.customers.list({limit: 3,});
                utils.send_response(this.wsManager, socket, { "type": data_original["type"], "response": customers }, this.module_id)
            break;
        }
        
          
        
        
        //utils.req(this.url_wilddock+url,method,data,this.wsManager,socket,'Stripe',data_original);
        
        //utils.send_response=(wsManager,socket,obj,send_response)
	    
	}// end sendStripe
	
	async createCharge(socket, type, params, stripelib) {
	    try {
	        const result = await stripelib.charges.create(params);
	        utils.send_response(this.wsManager, socket, { "type": type, "response": result }, this.module_id);
        } catch (error) {
          this.handleError(socket, type, error)
        }
	}
	
	async updateCustomer(socket, type, params, stripelib) {
	    try {
	        let customer_id = params['customer_id']
	        delete params['customer_id'];
	        const result = await stripelib.customers.update(
              customer_id,
              {...params}
            );
            utils.send_response(this.wsManager, socket, { "type": type, "response": result }, this.module_id);
        } catch (error) {
          this.handleError(socket, type, error)
        }
	}
	async createCustomer(socket, type, params, stripelib) {
        try {
            const result = await stripelib.customers.create(params);
            utils.send_response(this.wsManager, socket, { "type": type, "response": result }, this.module_id);
        } catch (error) {
          this.handleError(socket, type, error)
        }	    
	}
	
	async createTokenCard(socket, type, params, stripelib) {
        try {
            const token = await stripelib.tokens.create({
              card: params,
            });
            utils.send_response(this.wsManager, socket, { "type": type, "response": token }, this.module_id)
    
        } catch (error) {
          this.handleError(socket, type, error)
        }
    }
    
    async _getKeysbyOrg(key_api) {
        //key_api = "/api/5de0387b12e200ea63204d6c"
        let org_id = key_api.split('/')[key_api.split('/').length-1];
        try {
            const db = await connection('masterDB'); // obtenemos la conexión  
            const collection = db.collection('organizations');
            var query = {
              "_id": new ObjectID(org_id)
            };
            return await collection.findOne(query);
        }
        catch(e){
          console.log(" Catch Error finOne --- data Organization in "+this.module_id,e)
          return null;
        }
    }
      
    handleError(socket, type, error) {
        const response = {
          'object': 'error',
          'data':error || error.response || error.response.data || error.response.body || error.message || error,
        };
        utils.send_response(this.wsManager, socket, { type, response }, this.module_id);
    }
	
}//end Class 

module.exports = CoCreateStripe;
