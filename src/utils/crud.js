 var crud = require("@cocreate/server-crud");
 var config = require("../config/config.json");
 
 
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
    crud.connect(socket_config);
    crud.readDocument({
        collection: "organizations",
        document_id: params["organization_id"],
        "event": "getOrg",
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
  		        "apiKey": config["masterDB"]["apiKey"],
  		        "securityKey": config["masterDB"]["securityKey"],
  		        "organization_Id": config["masterDB"]["_id"],
  		    },
  		    "prefix": "ws",
  		    "host": "server.cocreate.app:8088"
  		};
  		crud.connect(socket_config);
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
	 crud.connect(socket_config);
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