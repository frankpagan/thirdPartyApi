'use strict'
var utils= require('../utils');
var ServerCrud = require("@cocreate/server-crud/src/index.js");


class CoCreateXXX {
	constructor(wsManager) {
		this.module_id = 'xxx';
		this.wsManager = wsManager;
		this.init();
		
	}
	
	init() {
		if (this.wsManager) {
			this.wsManager.on(this.module_id,		(socket, data, roomInfo) => this.sendXXX(socket, data, roomInfo));
		}
	}
	async sendXXX(socket, data, roomInfo) {
	    let that = this;
        let type = data['type'];
        let requestData = data.data;

        switch (type) {
            case 'xxxCreateRequest':
                // utils.send_response(that.wsManager, socket, {"type":type,"response":data.data}, this.module_id)
                this.receiveMessage(socket, type, requestData);
                break;
			case 'xxxCreateCard':
				utils.send_response(that.wsManager, socket, {"type":type,"response":data.data}, this.module_id)
				break;
        }
        
	}// end sendStripe
	
	receiveMessage(socket, type, data) {
		const self = this;

		console.log(data);
		const socket_config = {
		    "config": {
		        "apiKey": data.apiKey,
		        "securityKey": data.securityKey,
		        "organization_Id": data.organization_id,
		    },
		    "prefix": "ws",
		    "host": "server.cocreate.app:8088"
		}
		ServerCrud.SocketInit(socket_config)
		
		ServerCrud.ReadDocument({
			collection: "server-crud",
			document_id: "603fce3c89f1ed08c4505a21"
		}, socket_config.config);
		
		ServerCrud.listen('readDocument', function(response) {
			utils.send_response(self.wsManager, socket, {"type":type,"response":response}, self.module_id)
			ServerCrud.SocketDestory(socket_config);
		});
	}
	
	async receiveMessageAsync(socket, type, data) {
		const socket_config = {
		    "config": {
		        "apiKey": data.apiKey,
		        "securityKey": data.securityKey,
		        "organization_Id": data.organization_id,
		    },
		    "prefix": "ws",
		    "host": "server.cocreate.app:8088"
		}
		
		var crudSocket = await ServerCrud.SocketInitAsync(socket_config)
		
		var data = await ServerCrud.ReadDocumentAsync(crudSocket, {
			collection: "server-crud",
			document_id: "603fce3c89f1ed08c4505a21"
		}, socket_config.config);
		
		//. Mayeb we can 2 readDocumentAsync function for one socket
		
		var organization = await ServerCrud.ReadDocumentAsync(crudSocket, {organization_id: 'xxx'}, socket_config.config)
		var newConfig = {
			"apiKey": organization.apiKey,
			"securityKey": organization.securityKey,
			"organization_Id": organization.organization_Id
		}
		
		var twilioKey = await ServerCrud.ReadDocumentAsync(crudSocket, requestParameter, newConfig);
		
		//. 
		
		utils.send_response(this.wsManager, socket, {"type":type,"response":data}, this.module_id)
		
		await ServerCrud.DeleteDocumentAsync(socket);
		
	}
	
}//end Class 
module.exports = CoCreateXXX;
