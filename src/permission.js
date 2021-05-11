const CoCreatePermission = require('@cocreate/permissions');
const crud = require('@cocreate/crud-client');

const CoCreateSocketClient = require('@cocreate/socket-client')
let socket = new CoCreateSocketClient("ws");
crud.setSocket(socket);

class ApiPermission extends CoCreatePermission {
  constructor() {
    super();
    this.initEvent()
  }
  
  initEvent() {
    const self = this;
    console.log('yyyyy')
    crud.listen('updateDocument', (data) => self.refreshPermission(data))
    crud.listen('createDocument', (data) => self.refreshPermission(data))
    crud.listen('deleteDocument', (data) => self.refreshPermission(data))
  }
  
  async refreshPermission(data) {
    const {collection, document_id, organization_id, data : permissionData } = data
    if (collection === 'permissions' && this.hasPermission(permissionData.key)) {
      let new_permission = await this.getPermissionObject(permissionData.key, organization_id)
      this.setPermissionObject(permissionData.key, new_permission)
    }
  }
  
  getParameters(action, data) {
    const { data: {apiKey, organization_id, collection, securityKey, doucment_id}, type } = data;
    return {
			apikey: apiKey,
			organization_id,
			collection: null,
			plugin: action,
			type,
			doucment_id
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
            name: 'key',
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
      // console.log(response.data[0])
      return (response && response.data != null) ?  response.data[0] : null;
    } catch (err) {
      console.log(err)
      return  null;
    }
  }
}

module.exports = ApiPermission;
