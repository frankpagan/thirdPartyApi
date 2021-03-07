'use strict'
const utils = require('../utils');
const request = require('request');
const API_KEY = "TEST_QpHdYyPmniSoWSH9AdiJslPAHzo5wkhU4q4EjWwSF0k";

class CoCreateShipengine {
    constructor(wsManager) {
        this.module_id = 'shipengine';
        this.wsManager = wsManager;
        this.init();

    }

    init() {
        if (this.wsManager) {
            this.wsManager.on(this.module_id, (socket, data) => this.sendDataShipEngine(socket, data));
        }
    }

    async sendDataShipEngine(socket, data) {
        let type = data['type'];
        switch (type) {
            case 'getCarriers':
                await this.getCarriers(socket, type);
                break;
            case 'createShipment':
                await this.createShipment(socket, type, data);
                break;
            case 'getPrice':
                await this.getPrice(socket, type, data);
                break;
            case 'createLabel':
                await this.createLabel(socket, type, data);
                break;
            case 'trackPackage':
                await this.trackPackage(socket, type, data);
                break;
        }
    }

    async getCarriers(socket, type) {

        const options = {
            'method': 'GET',
            'url': 'https://api.shipengine.com/v1/carriers',
            'headers': {
                'Host': 'api.shipengine.com',
                'API-Key': API_KEY
            }
        };
        
        const resData = await this.invoke(options);

        const response = {
            'object': 'list',
            'data': resData.carriers,
        };
        utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id)
    }

    async createShipment(socket, type, data) {

        const reqData = data.data.shipments[0];

        const sendData = {
            "shipments": [
                {
                    "validate_address": reqData.validate,
                    "service_code": reqData.service_code,
                    "external_shipment_id": reqData.external_shipment_id,
                    "ship_to": reqData.ship_to[0],
                    "ship_from": reqData.ship_form[0],
                    "confirmation": "none",
                    "advanced_options": {},
                    "insurance_provider": "none",
                    "tags": [],
                    "packages": [
                        {
                            "weight": {
                                "value": 1,
                                "unit": "ounce"
                            }
                        }
                    ]
                }
            ]
        };
        
        const options = {
            'method': 'POST',
            'url': 'https://api.shipengine.com/v1/shipments',
            'headers': {
                'Host': 'api.shipengine.com',
                'API-Key': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        };

        const resData = await this.invoke(options);

        const response = {
            'object': 'list',
            'data': resData.shipments,
        };

        utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
    }

    async getPrice(socket, type, data) {

        const reqData = data.data;

        const sendData = {
            "shipment_id": reqData.shipmentId,
            "rate_options": {
                "carrier_ids": [reqData.carrierId]

            }
        };
        
        const options = {
            'method': 'POST',
            'url': 'https://api.shipengine.com/v1/rates',
            'headers': {
                'Host': 'api.shipengine.com',
                'API-Key': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)

        };

        const resData = await this.invoke(options);

        const response = {
            'object': 'list',
            'data': resData.rate_response.rates,
        };

        utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
    }

    async createLabel(socket, type, data) {

        const reqData = data.data.shipments[0];

        const sendData = {
            "shipment": {
                "service_code": reqData.service_code,
                "ship_to": reqData.ship_to[0],
                "ship_from": reqData.ship_form[0],
                "packages": [
                    {
                        "weight": {
                            "value": 20,
                            "unit": "ounce"
                        },
                        "dimensions": {
                            "height": 6,
                            "width": 12,
                            "length": 24,
                            "unit": "inch"
                        }
                    }
                ]
            }
        }

        const options = {
            'method': 'POST',
            'url': 'https://api.shipengine.com/v1/labels',
            'headers': {
                'Host': 'api.shipengine.com',
                'API-Key': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendData)
        };

        const resData = await this.invoke(options);

        const response = {
            'object': 'list',
            'data': [resData],
        };

        utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
    }

    async trackPackage(socket, type, data) {

        const reqData = data.data;

        const options = {
            'method': 'GET',
            'url': `https://api.shipengine.com/v1/labels/${reqData.labelId}/track`,
            'headers': {
                'Host': 'api.shipengine.com',
                'API-Key': API_KEY,
                'Cache-Control': 'no-cache'
            }
        };

        const resData = await this.invoke(options);

        const response = {
            'object': 'list',
            'data': [resData],
        };

        utils.send_response(this.wsManager, socket, { "type": type, "response": response }, this.module_id);
    }

    invoke(options) {
        return new Promise((resolve, reject) => {
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                try {
                    const data = JSON.parse(body);
                    return resolve(data);
                } catch (err) {
                    return resolve(err);
                }
            });
        });
    }

}
module.exports = CoCreateShipengine;
