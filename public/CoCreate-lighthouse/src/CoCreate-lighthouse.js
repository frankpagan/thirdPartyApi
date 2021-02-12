const CoCreateLightHouse = {
    id: 'lighthouse',
    actions: [
        'getHtml',
    ],

    action_getHtml: function (element, data) {
        let container = element.closest("form");
        let formdData = CoCreateApi.getFormData('lighthouse', 'getHtml', container);
        CoCreateApi.send('lighthouse', 'getHtml', formdData);
    },
}


CoCreate.api.init({
	name: CoCreateLightHouse.id, 
	module:	CoCreateLightHouse,
});