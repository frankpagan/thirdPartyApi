
const CoCreateInstagram = {
	id: 'instagram',
	actions: [
		'getUserProfile'
	],

	render_getUserProfile: function(data) {
		console.log(data)
	}
};

CoCreate.api.init({
	name: CoCreateInstagram.id, 
	module:	CoCreateInstagram,
});