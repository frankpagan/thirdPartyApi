'use strict'
const utils = require('../utils');


class CoCreateInstagram {
	constructor(wsManager) {
		this.wsManager = wsManager;
		this.module_id = "instagram";
		this.init();
	}

	init() {
		if (this.wsManager) {
			this.wsManager.on(this.module_id, (socket, data) => this.sendinstagram(socket, data));
		}
	}

	async sendinstagram(socket, data) {
		let type = data['type'];
		const params = data['data'];

		/*const params = data['data'];
        const socket_config = {
		    "config": {
		        "apiKey": params["apiKey"],
		        "securityKey": params["securityKey"],
		        "organization_Id": params["organization_id"],
		    },
		    "prefix": "ws",
		    "host": "server.cocreate.app:8088"
		}
		ServerCrud.SocketInit(socket_config)
		
		// await fg = ServerCrud.ReadDocument({
		ServerCrud.ReadDocument({
			collection: "organizations",
			document_id: params["organization_id"]
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
        */
		try {
			switch (type) {
				case 'getUserProfile':
					this.getUserProfile(socket, type, params);
					break;
			}

		} catch (error) {
			this.handleError(socket, type, error)
		}
	}


	async getUserProfile(socket, type, params) {
		try {

			const response = {
				'object': 'list',
				'data': 'testing success',
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

module.exports = CoCreateInstagram;