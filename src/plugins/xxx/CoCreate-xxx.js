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
			this.wsManager.on(this.module_id,		(socket, data) => this.sendXXX(socket, data));
		}
	}
	async sendXXX(socket, data) {
	    let that = this;
        let type = data['type'];
        
        

        switch (type) {
            case 'xxxCreateRequest':
                // utils.send_response(that.wsManager, socket, {"type":type,"response":data.data}, this.module_id)
                this.receiveMessage(socket, type);
                break;
			case 'xxxCreateCard':
				utils.send_response(that.wsManager, socket, {"type":type,"response":data.data}, this.module_id)
				break;
        }
        
	}// end sendStripe
	
	receiveMessage(socket, type) {
		const self = this;
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
		
		ServerCrud.ReadDocument({
			collection: "server-crud",
			document_id: "603fce3c89f1ed08c4505a21"
		}, socket_config.config);
		
		ServerCrud.listen('readDocument', function(data) {
			utils.send_response(self.wsManager, socket, {"type":type,"response":data}, self.module_id)
			ServerCrud.SocketDestory(socket_config);
		});
		
		
	}
	
}//end Class 
module.exports = CoCreateXXX;
