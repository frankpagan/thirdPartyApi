'use strict'
var utils= require('../utils');

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
                utils.send_response(that.wsManager, socket, {"type":type,"response":data.data}, this.module_id)
                break;
			case 'xxxCreateCard':
				utils.send_response(that.wsManager, socket, {"type":type,"response":data.data}, this.module_id)
				break;
        }
        
	}// end sendStripe
	
}//end Class 
module.exports = CoCreateXXX;
