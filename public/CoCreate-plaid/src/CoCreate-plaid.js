const CoCreatePlaid = {
	id: 'plaid',
	actions: [
		'plaidGetLinkToken',
		'plaidGetPublicToken',
		'plaidTransaction',
		'plaidBalances',
		'plaidAuth',
	],
	
	render_plaidCreateBankLink: function(data) {
		console.log(data);
	},
	
	action_plaidGetPublicToken: function(element, data){
		const configs = {
		  token: data.data.data.link_token,
		  env: 'sandbox',
		  onSuccess: async function(public_token, metadata){
		     CoCreateApi.send('plaid', 'plaidGetAccessToken', public_token);
		  },
		  onExit: async function(err, metadata) {
		     if (err != null) {
		         console.log(err);
		         console.log(metadata);   
		     }
		  }
		}
		const linkHandler = Plaid.create(configs);
		linkHandler.open();
	},
	
	render_plaidTransaction: function(data) {
		console.log(data);
	},
	
	render_plaidBalances: function(data) {
		console.log(data);
	},
	
	render_plaidAuth: function(data) {
		console.log(data);
	}
}

CoCreate.api.init({
	name: CoCreatePlaid.id, 
	module:	CoCreatePlaid,
});