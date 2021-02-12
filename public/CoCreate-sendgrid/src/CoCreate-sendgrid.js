
const CoCreateSendGrid = {
	id: 'sendgrid',
	actions: [
		'sendgridDomainList',
		'sendgridDomainAuthenticate',
		'sendDNSEmail',
		'getSubUsersList',
		'postSubUser',
		'getMarketingContacts',
		'postMarketingContact',
		'getMarketingStats',
		'getMarketingSinglesends',
		'getEmailAddress',
		'EmailValidation',
		'sendEmail'
	],

	render_sendgridDomainList: function (data) {
		console.log(data);
	},

	render_sendgridDomainAuthenticate: function (data) {
		console.log(data);
	},

	render_sendDNSEmail: function (data) {
		console.log(data);
	},

	render_getSubUsersList: function (data) {
		console.log(data);
	},

	render_getMarketingContacts: function (data) {
		console.log(data);
	},
	
	render_postMarketingContact: function (data) {
		console.log(data);
	},
	
	render_getMarketingStats: function (data) {
		console.log(data);
	},
	
	render_getMarketingSinglesends: function (data) {
		console.log(data);
	},
	
	render_getEmailAddress: function (data) {
		console.log(data);
	},
	
	render_EmailValidation: function (data) {
		console.log(data);
	},
	
	render_sendEmail : function (data) {
		console.log(data);
	},
}

CoCreate.api.init({
	name: CoCreateSendGrid.id, 
	module:	CoCreateSendGrid,
});