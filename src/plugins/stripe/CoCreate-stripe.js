/* global Y */
'use strict'
var utils= require('../utils');
var ServerCrud = require("@cocreate/server-crud/src/index.js");
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
		this.wsManager.on('stripe',		(socket, data, roomInfo) => this.sendStripe(socket, data, roomInfo));
		}
	}
	async sendStripe(socket, data,roomInfo) {
	    let that = this;
	    let send_response ='stripe';
	    let data_original = {...data};
	    const params = data['data'];
	    console.log("Stripe ",data_original);
        let type = data['type'];
        delete data['type'];
        let url = '';
        let method = '';
        let targets = [];
        let tags = [];
        let key_stripe = 'sk_test_4eC39HqLyjWDarjtT1zdp7dc'
       
        const socket_config = {
    	    "config": {
    	        "apiKey": params["apiKey"],
    	        "securityKey": params["securityKey"],
    	        "organization_Id": params["organization_id"],
    	    },
    	    "prefix": "ws",
    	    "host": "server.cocreate.app:8088"
    	}
    	
    	var crudSocket = await ServerCrud.SocketInitAsync(socket_config);
    	var org_row = await ServerCrud.ReadDocumentAsync(crudSocket,{
    		collection: "organizations",
    		document_id: params["organization_id"]
    	}, socket_config.config);
    	let org_data;
    	let apiKeysOrg;
    	try{
    		org_data = org_row["data"]["data"];
    		apiKeysOrg =org_data["apis"]["stripe"];
    	  }catch(e){
    		console.log(this.module_id+": Error GET ORG",e);
    		return false;
    	  }
    	 // connect api
    	 let stripe = false;
    	 try{
    	     let enviroment = 'prod'; //'test'
            //let enviroment = 'test'
            let key  = apiKeysOrg[enviroment]
            stripe = require('stripe')(key);
    	 }catch(e){
    	   	console.log(this.module_id+" : Error Connect to api",e)
    	   	return false;
    	 }
  
          
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
      
    handleError(socket, type, error) {
        const response = {
          'object': 'error',
          'data':error || error.response || error.response.data || error.response.body || error.message || error,
        };
        utils.send_response(this.wsManager, socket, { type, response }, this.module_id);
    }
	
}//end Class 
module.exports = CoCreateStripe;
