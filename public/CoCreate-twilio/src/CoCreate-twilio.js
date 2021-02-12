
const CoCreateTwilio = {
	id: 'twilio',
	actions: [
		'twilioListSubAccounts',
		'twilioPurchasePhoneNumber',
		'twiliofetchAvailbleNumbers',
		'twilioCreateSubAccount',
		'twilioDeleteSubAccount',
		'twilioGetUsage',
		'twilioPhoneNumberList',
		'twilioGetIncommingPhoneNumbers',
		'twilioGetBillingUsages',
		'twilioDeletePhoneNumber',
		'updateIncomingPhoneNumber',
	],
	
	render_twilioListSubAccounts: function(data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
        // CoCreate.api.render('randermsg', data);
    },
	
	render_twilioCreateSubAccount: function(data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
	},
	
	render_twilioDeleteSubAccount: function(data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
	},
	
	render_twilioPurchasePhoneNumber: function(data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
	},
	
	render_twilioGetIncommingPhoneNumbers : function(data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
	},
	
	render_twiliofetchAvailbleNumbers: function(data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
	},
	
	render_twilioGetUsage: function(data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
        console.table(data.data)
	},
	
	render_twilioPhoneNumberList: function(data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
	},
	
	render_twilioGetBillingUsages: function(data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
	},
	
// 	action_twilioListSubAccounts: function(element, data) {
// 		//. data rendering by cocreate-render
// 		console.log('rander',data)
// 	    CoCreate.api.render(this.id, 'xxxCreateCard', {render2: data});

// 	}
}

CoCreate.api.init({
	name: CoCreateTwilio.id, 
	module:	CoCreateTwilio,
});