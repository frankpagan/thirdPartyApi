
const CoCreatePinterest = {
	id: 'pinterest',
	actions: [
		'getUserShow',
		'getBoardList'
	],
	render_getBoardList: function(data) {
		console.log(data);
	},

	render_getUserShow: function(data) {
		console.log(data);
	},
	
}


CoCreate.api.init({
	name: CoCreatePinterest.id, 
	module:	CoCreatePinterest,
});