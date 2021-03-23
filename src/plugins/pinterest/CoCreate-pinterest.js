'use strict'
var utils= require('../utils');

class CoCreatePinterest {
	constructor(wsManager) {
		this.module_id = 'pinterest';
		this.wsManager = wsManager;
		this.init();
		
	}
	
	init() {
		if (this.wsManager) {
			this.wsManager.on(this.module_id, (socket, data) => this.pinterestOperations(socket, data));
		}
	}
	async pinterestOperations(socket, data) {
	    let that = this;
        let type = data['type'];
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

        switch (type) {
            case 'getBoardList':
                utils.send_response(that.wsManager, socket, {"type":type,"response":data.data}, this.module_id)
                break;
			case 'getUserShow':
				utils.send_response(that.wsManager, socket, {"type":type,"response":data.data}, this.module_id)
				break;
        }
        
	}// end sendStripe
	
}//end Class 
module.exports = CoCreatePinterest;
