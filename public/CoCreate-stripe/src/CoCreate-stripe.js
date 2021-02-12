
const CoCreateStripe = {
	id: 'stripe',
	actions: [
		'stripeListCustomers',
		'stripeBalanceTranscation',
		'stripeGetBalance'
	],
	
	render_stripeBalanceTranscation: function(data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
	},
	
	render_stripeGetBalance: function(data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
	}, 
	
	render_stripeListCustomers: function(data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
	}
}

CoCreate.api.init({
	name: CoCreateStripe.id, 
	module:	CoCreateStripe,
});