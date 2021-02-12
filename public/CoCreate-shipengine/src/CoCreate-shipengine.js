
const CoCreateShipEngine = {
    id: 'shipengine',
    actions: [
        'getCarriers',
        'createShipment',
        'getPrice',
        'createLabel',
        'trackPackage',
    ],

    render_getCarriers: function (data) {
        console.log(data);
    },

    render_shipengineGetPrice: function (data) {
        console.log(data);
    },

    action_createShipment: function (element, data) {
        let container = element.closest("form");
        let shippingdata = CoCreateApi.getFormData('shipengine', 'createShipment', container);
        console.log(shippingdata);
        CoCreateApi.send('shipengine', 'createShipment', shippingdata);
    },

    action_getPrice: function (element, data) {
        let container = element.closest("form");
        let shippingdata = CoCreateApi.getFormData('shipengine', 'getPrice', container);
        console.log(shippingdata);
        CoCreateApi.send('shipengine', 'getPrice', shippingdata);
    },

    action_createLabel: function (element, data) {
        let container = element.closest("form");
        let shippingdata = CoCreateApi.getFormData('shipengine', 'createLabel', container);
        console.log(shippingdata);
        CoCreateApi.send('shipengine', 'createLabel', shippingdata);
    },

    action_trackPackage: function (element, data) {
        let container = element.closest("form");
        let shippingdata = CoCreateApi.getFormData('shipengine', 'trackPackage', container);
        console.log(shippingdata);
        CoCreateApi.send('shipengine', 'trackPackage', shippingdata);
    }
}


CoCreate.api.init({
	name: CoCreateShipEngine.id, 
	module:	CoCreateShipEngine,
});