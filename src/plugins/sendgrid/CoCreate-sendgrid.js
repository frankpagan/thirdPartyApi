'use strict';
const utils = require('../utils');
const axios = require("axios").default;
const sgMail = require('@sendgrid/mail');
const connection = require('../../config/dbConnection.js');
var ObjectID = require('mongodb').ObjectID;
var ServerCrud = require("@cocreate/server-crud/src/index.js");

const apiKey = 'Bearer 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';
sgMail.setApiKey('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');

//old:- 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
//new:- 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

const hostName = "https://api.sendgrid.com/v3";

class CoCreateSendGrid {
  constructor(wsManager) {
    this.wsManager = wsManager;
    this.module_id = "sendgrid";
    this.init();
    this.apiKey = null;
  }

  init() {
    if (this.wsManager) {
      //this.wsManager.on(this.module_id, (socket, data) => this.sendSendGrid(socket, data));
      this.wsManager.on(this.module_id,		(socket, data, roomInfo) => this.sendSendGrid(socket, data, roomInfo));
    }
  }

  async sendSendGrid(socket, data,roomInfo) {
    const type = data['type'];
    const params = data['data'];
    const module_id = this.module_id;
    
    const org_id = roomInfo["key"];
    let org = await this._getKeysbyOrg(org_id);
    
    const socket_config = {
		    "config": {
		        "apiKey": org["apiKey"],
		        "securityKey": org["securityKey"],
		        "organization_Id": org._id,
		    },
		    "prefix": "ws",
		    "host": "server.cocreate.app:8088"
		}
		ServerCrud.SocketInit(socket_config)
		
		// await fg = ServerCrud.ReadDocument({
		ServerCrud.ReadDocument({
			collection: "organizations",
			document_id: org._id
		}, socket_config.config);
		
		ServerCrud.listen('readDocument', function(data) {
			console.log("module_id",module_id)
			try{
			  console.log("------ readDocument ",data)
		  	console.log("------ aPIKEY ",data["data"]["apis"][module_id])
		  
			}
			 catch(e){
			  console.log(" --- Error ",e)
			}
			//ServerCrud.SocketDestory(socket_config);
		});
		
		
		/// WE NEED APIKEY IN ALL METHODS, BUT APIKEY IS ON SOCKET LISTEN
		
    switch (type) {
      case 'sendEmail':
        await this.sendEmail(socket, type, params);
        break;

      case 'domainList':
        await this.getDomainList(socket, type, params);
        break;

      case 'domainAuthenticate':
        await this.authenticateDomain(socket, type, params);
        break;
        
      case 'domainValidate':
        await this.domainValidate(socket, type, params);
        break;
        
      case 'sendDNSEmail':
        await this.sendDNSEmail(socket, type, params);
        break;

      case 'getSubUsersList':
        await this.getSubUsersList(socket, type, params);
        break;

      case 'postSubUser':
        await this.postSubUser(socket, type, params);
        break;

      case 'postSubUser':
        await this.postSubUser(socket, type, params);
        break;

      case 'getMarketingContacts':
        await this.getMarketingContacts(socket, type, params);
        break;

      case 'postMarketingContact':
        await this.postMarketingContact(socket, type, params);
        break;

      case 'getMarketingStats':
        await this.getMarketingStats(socket, type, params);
        break;

      case 'getMarketingSinglesends':
        await this.getMarketingSinglesends(socket, type, params);
        break;

      case 'EmailValidation':
        await this.EmailValidation(socket, type, params);
        break;

      case 'getEmailAddress':
        await this.getEmailAddress(socket, type, params);
        break;

    }
  }

  async sendEmail(socket, type, params) {
    console.log(params)
    try {
      const { to, from , subject, text, html } = params
		const msg = {
		  to,
		  from,
		  subject,
		  text,
		  html,
		};
		
		const data = await sgMail.send(msg);
		
    	utils.send_response(this.wsManager, socket, { "type": type, "response": data }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async getDomainList(socket, type, params) {
    try {
      const { data } = await axios.get(`${hostName}/whitelabel/domains`, {
        "headers": {
          "authorization": apiKey,
        }
      })
      const resposne = {
        data: data,
        object: "list"
      }
      utils.send_response(this.wsManager, socket, { "type": type, "response": resposne }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async authenticateDomain(socket, type, params) {
    try {
      const { domain_name } = params
      const { data } = await axios.post(`${hostName}/whitelabel/domains`, {
        domain: domain_name,
        custom_spf: false,
        default: false,
        valid:true,
        automatic_security: true
      }, {
        "headers": {
          "authorization": apiKey,
        }
      })
      utils.send_response(this.wsManager, socket, { "type": type, "response": data }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async sendDNSEmail(socket, type, params) {
    try {
      const { link_id, domain_id, email } = params
      const { data } = await axios.post(`${hostName}/whitelabel/dns/email`, {
        "link_id": Number(link_id),
        "domain_id": Number(domain_id),
        email
      }, {
        "headers": {
          "authorization": apiKey,
        }
      })
      utils.send_response(this.wsManager, socket, { "type": type, "response": data }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async postSubUser(socket, type, params) {
    try {
      const { username, email, password, ips } = params
      const { data } = await axios.post(`${hostName}/subusers`, {
        username,
        email,
        password,
        ips
      }, {
        "headers": {
          "authorization": apiKey,
        }
      })
      utils.send_response(this.wsManager, socket, { "type": type, "response": data }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async getSubUsersList(socket, type) {
    try {
      const { data } = await axios.get(`${hostName}/subusers`, {
        "headers": {
          "authorization": apiKey,
        }
      })
      const resposne = {
        data: data,
        object: "list"
      }
      utils.send_response(this.wsManager, socket, { "type": type, "response": resposne }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async getMarketingContacts(socket, type) {
    try {
      const { data } = await axios.get(`${hostName}/marketing/contacts`, {
        "headers": {
          "authorization": apiKey,
        }
      })
      const resposne = {
        data: data,
        object: "list"
      }
      utils.send_response(this.wsManager, socket, { "type": type, "response": resposne }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async postMarketingContact(socket, type, params) {
    try {
      const { email, first_name, last_name, city, country, postal_code, address_line_1 } = params
      const { data } = await axios.put(`${hostName}/marketing/contacts`, {
        "contacts": [
          {
            address_line_1,
            "alternate_emails": [email],
            city,
            country,
            email,
            first_name,
            last_name,
            postal_code,
            "custom_fields": {}
          }
        ]
      }, {
        "headers": {
          "authorization": apiKey,
          "Content-Type": "application/json"
        }
      })
      utils.send_response(this.wsManager, socket, { "type": type, "response": data }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async getMarketingStats(socket, type) {
    try {
      const { data } = await axios.get(`${hostName}/marketing/stats/automations`, {
        "headers": {
          "authorization": apiKey,
        }
      })
      const resposne = {
        data: data,
        object: "list"
      }
      utils.send_response(this.wsManager, socket, { "type": type, "response": resposne }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async getMarketingSinglesends(socket, type) {
    try {
      const { data } = await axios.get(`${hostName}/marketing/stats/singlesends`, {
        "headers": {
          "authorization": apiKey,
        }
      })
      const resposne = {
        data: data,
        object: "list"
      }
      utils.send_response(this.wsManager, socket, { "type": type, "response": resposne }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async EmailValidation(socket, type, params) {
    try {
      const { email } = params
      const { data } = await axios.post(`${hostName}/validations/email`, { email }, {
        "headers": {
          "authorization": apiKey,
          "Content-Type": "application/json"
        }
      })
      utils.send_response(this.wsManager, socket, { "type": type, "response": data }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async getEmailAddress(socket, type) {
    try {
      const { data:userEmail } = await axios.get(`${hostName}/user/email`, {
        "headers": {
          "authorization": apiKey,
          "Content-Type": "application/json"
        }
      })
        const { data } = await axios.get(`${hostName}/verified_senders`, {
        "headers": {
          "authorization": apiKey,
          "Content-Type": "application/json"
        }
      })
      const resposne = {
        data:  { "userEmail"  :userEmail.email,	"results" : data.results },
        object: "list"
      }
      utils.send_response(this.wsManager, socket, { "type": type, "response": resposne }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async domainValidate(socket, type, params) {
    try {
      const { id_domain } = params
      const { data } = await axios.post(`${hostName}/whitelabel/domains/${id_domain}/validate`,{}, {
        "headers": {
          "authorization": apiKey,
        }
      })
      
      utils.send_response(this.wsManager, socket, { "type": type, "response": data }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }
  
  handleError(socket, type, error) {
    const response = {
      'object': 'error',
      'data': error.response.data || error.response.body || error.message || error,
    };
    utils.send_response(this.wsManager, socket, { type, response }, this.module_id);
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
      
  
}

module.exports = CoCreateSendGrid;