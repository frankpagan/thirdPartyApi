'use strict'
const utils = require('../utils');


class CoCreateDataInstagram {
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

module.exports = CoCreateDataInstagram;