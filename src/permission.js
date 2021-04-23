const CoCreatePermission = require('@cocreate/permissions');
const crud = require('@cocreate/crud-client');

const CoCreateSocketClient = require('@cocreate/socket-client')
let socket = new CoCreateSocketClient("ws");
crud.setSocket(socket);

class ApiPermission extends CoCreatePermission {
  constructor() {
    super();
  }
  
  getParameters(action, data) {
    const { data: {apiKey, organization_id, collection, securityKey}, type } = data;
    return {
			apikey: apiKey,
			organization_id,
			key: 'plugins',
			key_value: action,
			type: type
    }
  }
  
  async getPermissionObject(key, organization_id) {
    try {
      const socket_config = { 
        "config": {
          "apiKey": key,
          "securityKey": 'testing',
          "organization_id": organization_id,
        },
        "prefix": "ws",
        "host": "server.cocreate.app:8088"
      }
      socket.create({
        namespace: socket_config.config.organization_id,
        room: null,
        host: socket_config.host
      })
      
      let eventPermission = "getPermissionEvent";
      crud.readDocumentList({
        collection: "permissions",
        operator: {
          filters: [{
            name: 'apikey',
            operator: "$eq",
            value: [key]
          }],
        },
        event: eventPermission,
        apiKey: socket_config["config"]["apiKey"],
        securityKey: socket_config["config"]["securityKey"],
        organization_id: socket_config["config"]["organization_id"]
      });
      
      console.log('ready data')
      
      
      let response = await crud.listenAsync(eventPermission);
      console.log('--------- permission loaded ------- ')

      return (response && response.data != null) ?  response.data[0] : null;
    } catch (err) {
      console.log(err)
      return  null;
    }
  }
}

module.exports = ApiPermission;
