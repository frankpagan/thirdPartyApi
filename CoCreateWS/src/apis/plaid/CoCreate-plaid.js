'use strict'
const utils = require('../utils');

class CoCreateDataPlaid {
    constructor(wsManager) {
        this.wsManager = wsManager;
        this.module_id = 'plaid';
        this.init();
    }

    init() {
        if (this.wsManager) {
            this.wsManager.on(this.module_id, (socket, data) => this.sendCreateBank(socket, data));
        }
    }

    async sendCreateBank(socket, data) {
        const type = data['type'];
        const params = data['data'];
        const plaid = require('plaid');

        const client = new plaid.Client({
            clientID: "5f64c507166e6d0012449b6c",
            secret: "3132debb49806b95f75a35e1e1bdc5",
            env: plaid.environments.sandbox,
        });
        switch (type) {
            case 'plaidGetLinkToken':
                this.plaidGetLinkToken(socket, type, client, params);
                break;
            case 'plaidGetPublicToken':
                this.plaidGetPublicToken(socket, type, client);
            case 'plaidGetAccessToken':
                this.plaidGetAccessToken(socket, type, client, data);
            case 'plaidTransaction':
                this.pladTransaction(socket, type, client, params);
                break;
            case 'plaidBalances':
                this.plaidBalances(socket, type, client, params);
                break;
            case 'plaidAuth':
                this.plaidAuth(socket, type, client, params);
                break;
            default:
                break;
        }
    }

    async plaidGetLinkToken(socket, type, client, params) {
        const { userId, legalName, phoneNumber, email } = params;
        try {
            const tokenResponse = await client.createLinkToken({
                user: {
                    client_user_id: userId,
                    legal_name: legalName,
                    phone_number: phoneNumber,
                    email_address: email,
                },
                client_name: 'CoCreate',
                products: ['transactions'],
                country_codes: ['US'],
                language: 'en',
                webhook: 'https://webhook.sample.com',
            });
            utils.send_response(this.wsManager, socket, { "type": type, "response": { "data": tokenResponse } }, this.module_id)
        } catch (e) {
            return utils.send_error({ error: e.message });
        }
    }

    async plaidGetAccessToken(socket, type, client, data) {
        let public_token = data.data;
        const accessTokenResponse = await client.exchangePublicToken(public_token);
        utils.send_response(this.wsManager, socket, { "type": type, "response": { "data": accessTokenResponse } }, this.module_id)
    }

    async pladTransaction(socket, type, client, params) {
        const { accessToken } = params;
        const response = await client.getTransactions(accessToken, '2018-01-01', '2020-02-01', {})
            .catch((err) => {
                console.error(err.message);
            });
        const transactions = response.transactions;
        utils.send_response(this.wsManager, socket, { "type": type, "response": { "data": transactions } }, this.module_id)
    }

    async plaidBalances(socket, type, client, params) {
        const { accessToken } = params;
        const response = await client.getBalance(accessToken)
            .catch((err) => {
                console.error(err.message);
            });
        const balances = response.accounts;
        utils.send_response(this.wsManager, socket, { "type": type, "response": { "data": balances } }, this.module_id)
    }

    async plaidAuth(socket, type, client, params) {
        const { accessToken } = params;
        const response = await client.getAuth(accessToken)
            .catch((err) => {
                console.error(err.message);
            });
        const auth = response.numbers.ach;
        utils.send_response(this.wsManager, socket, { "type": type, "response": { "data": auth } }, this.module_id)
    }
}

module.exports = CoCreateDataPlaid;
