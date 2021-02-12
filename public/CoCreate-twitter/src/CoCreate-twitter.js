
const CoCreateTwitter = {
    id: 'twitter',
    actions: [
        'getFollowersList',
        'getUsersShow',
        'getSearchUser',
        'getFriendsList',
        'getSearchTweets',
        'getUserslookup',
        'getUserTimeline',
        'getTrendsPlace',
        'postTweet',
        'getOauth2Token'
    ],

    render_getFollowersList: function (data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
    },

    render_getUsersShow: function (data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
    },

    render_getSearchUser: function (data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
    },

    render_getFriendsList: function (data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
    },

    render_getSearchTweets: function (data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
    },

    render_getUserslookup: function (data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
    },

    render_getUserTimeline: function (data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
    },

    render_getTrendsPlace: function (data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
    },

    render_postTweet: function (data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
    },
    
    render_getOauth2Token: function (data) {
        if (data.object == "error") {
            alert(data.data)
        }
        console.log(data);
    }
};


CoCreate.api.init({
	name: CoCreateTwitter.id, 
	module:	CoCreateTwitter,
});