const crud = require('@cocreate/crud-client')
const CoCreateSocketClient = require('@cocreate/socket-client')
let socket = new CoCreateSocketClient("ws");
var config = require("../../CoCreate.config.js");

crud.setSocket(socket);

 
 module.exports.getOrg = async function(params,module) {
 	console.log(params)
    const socket_config = { 
	    "config": {
	        "apiKey": params["apiKey"],
	        "securityKey": params["securityKey"],
	        "organization_id": params["organization_id"],
	    },
	    "prefix": "ws",
	    "host": "server.cocreate.app:8088"
	}
	socket.create({
		namespace: socket_config.config.organization_id,
		room: null,
		host: socket_config.host
	})
    const event = "getOrg";
    
    crud.readDocument({
        collection: "organizations",
        document_id: params["organization_id"],
        event,
        apiKey: params["apiKey"],
	    securityKey: params["securityKey"],
	    organization_id: params["organization_id"]
    });
    let org_row = await crud.listenAsync(event);
    console.log(org_row)
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
			namespace: socket_config.config.organization_Id,
			room: null,
			host: socket_config.host
		})

  		let eventGetOrg = "getOrginMaster";
  		
  		 crud.readDocumentList({
	        collection: "organizations",
	        operator: {
	  				filters: [{
	  					name: 'domains',
	  					operator: "$in",
	  					value: [hostname]
	  				}],
	  				orders: [],
	  				startIndex: 0,
	  				search: { type: 'or', value: []}
	        },
	        event: eventGetOrg,
	        is_collection: false,
	        apiKey: config["config"]["apiKey"],
		    securityKey: config["config"]["securityKey"],
		    organization_id: config["config"]["organization_id"]
	    });
    
  	/*	crud.readDocument({
    	collection: "organizations",
        operator: {
  				filters: [{
  					name: 'domains',
  					operator: "$in",
  					value: [hostname]
  				}]
        },
        "event": eventGetOrg,
        apiKey: config["config"]["apiKey"],
	    securityKey: config["config"]["securityKey"],
	    organization_id: config["config"]["organization_id"]
      });*/
      
      console.log("trigger event get org")
     let data2 = await crud.listenAsync(eventGetOrg);
     console.log("data2 ===",data2)
   
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
	socket.create({
	  namespace: socket_config.config.organization_Id,
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
						}],
						orders: [],
		  				startIndex: 0,
		  				search: { type: 'or', value: []}
		      },
         "event": "getDataOrg",
         is_collection: false,
         apiKey: org["apiKey"],
	    securityKey: org["securityKey"],
	    organization_id: org["_id"]
	});
    let myOrg = await crud.listenAsync("getDataOrg");
    let result = {'row':myOrg,'socket_config':socket_config};
    return result;
 }