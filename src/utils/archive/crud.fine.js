 //var crud = require("@cocreate/server-crud");
const crud = require('@cocreate/crud-client')
const CoCreateSocketClient = require('@cocreate/socket-client')
let socket = new CoCreateSocketClient("ws");
var config = require("../../CoCreate.config.js");

crud.setSocket(socket);

 
 module.exports.getOrg = async function(params,module) {
    const socket_config = {
	    "config": {
	        "apiKey": params["apiKey"],
	        "securityKey": params["securityKey"],
	        "organization_Id": params["organization_id"],
	    },
	    "prefix": "ws",
	    "host": "server.cocreate.app:8088"
	}
	socket.create({
	  namespace: socket_config.config.organization_id,
		room: null,
		host: socket_config.host
	})
    socket.setGlobalScope(socket_config.config.organization_id)
    
    crud.readDocument({
        collection: "organizations",
        document_id: params["organization_id"],
        "event": "getOrg",
        apiKey: params["apiKey"],
	    securityKey: params["securityKey"],
	    organization_id: params["organization_id"]
    }, socket_config.config);
    let org_row = await crud.listenAsync("getOrg");
    try{
		org_row =org_row["data"];
	  }catch(e){
		  console.log(module," Error GET ORG  in : ",e);
		return false;
	  }
	 return org_row;
}

 module.exports.getOrgInRoutesbyHostname = async function(hostname) {
 	var socket_config = {
  		    "config": {
  		        "apiKey": config["config"]["apiKey"],
  		        "securityKey": config["config"]["securityKey"],
  		        "organization_Id": config["config"]["organization_id"],
  		    },
  		    "prefix": "ws",
  		    "host": "server.cocreate.app:8088"
  		};
  		socket.create({
		  namespace: socket_config.config.organization_id,
			room: null,
			host: socket_config.host
		})
	    socket.setGlobalScope(socket_config.config.organization_id)
  		let eventGetOrg = "getOrginMaster";
  		crud.readDocumentList({
    	collection: "organizations",
        operator: {
  				filters: [{
  					name: 'domains',
  					operator: "$in",
  					value: [hostname]
  				}]
        },
        // "async": true,
        "event": eventGetOrg,
      }, socket_config.config);
     let data2 = await crud.listenAsync(eventGetOrg);
   
	 var org = data2["data"][0]

	 var socket_config = {
		    "config": {
		        "apiKey": org["apiKey"],
		        "securityKey": org["securityKey"],
		        "organization_Id": org["_id"].toString(),
		    },
		    "prefix": "ws",
		    "host": "server.cocreate.app:8088"
		}
		//other connection
	 //crud.createSocket(socket_config);
	socket.create({
	  namespace: socket_config.config.organization_id,
		room: null,
		host: socket_config.host
	})
    // socket.setGlobalScope(socket_config.config.organization_id)
	 crud.readDocumentList({
		      collection: "organizations",
		      operator: {
						filters: [{
							name: '_id',
							operator: "$eq",
							value: [org["_id"].toString()]
						}]
		      },
         "event": "getDataOrg",
	}, socket_config.config);
    let myOrg = await crud.listenAsync("getDataOrg");
    let result = {'row':myOrg,'socket_config':socket_config};
    return result;
 }