const CRUD = require("@cocreate/server-crud/src/index.js")
const {generateUUID} = require("@cocreate/server-crud/src/core/utils.js")
// const CoCreate = require("./index.js")
/**
 * Socket init 
 */
 
 var config = require("@cocreate/server-crud/src/config.json");


// const socket_config = {
//     "config": {
//         "apiKey": "c2b08663-06e3-440c-ef6f-13978b42883a",
//         "securityKey": "f26baf68-e3a9-45fc-effe-502e47116265",
//         "organization_Id": "5de0387b12e200ea63204d6c",
//     },
//     "prefix": "ws",
//     "host": "server.cocreate.app:8088"
// };

async function runFunc() {
  try {
//     CRUD.connect(socket_config);
//     var event1 = generateUUID();
//     var event2 = generateUUID()
    
//     CRUD.readDocumentList({
//       collection: "items-ordered",
//       element: "items",
//       is_collection: false,
//       async: true,
//       event: event1,
//     }, socket_config.config)
    
//     CRUD.readDocument({
//       "collection": "test",
//       "document_id": "60517e335fc27f0dc71d65b8",
//       "async": true,
//       "event": event2,
//     }, socket_config.config)

// console.log('----------------------------------------------')

// 	 // let data1 = await socketEventAsync(eventname); // and this too
//     let data1 = await CRUD.listenAsync(event1);
//     console.log(data1)
//     console.log('----------------------------------------------')
//     let data2 = await CRUD.listenAsync(event2);
//     console.log(data2)
    
//     CRUD.listen('readDocumentList', function(data) {
//       console.log('receive readDocumentList')
//     });
//     CRUD.listen('readDocument', function(data) {
//       console.log('receive readDocument')
//     });

    
//     return "Ended *********************************************"


      var socket_config = {
  		    "config": {
  		        "apiKey": config["masterDB"]["apiKey"],
  		        "securityKey": config["masterDB"]["securityKey"],
  		        "organization_Id": config["masterDB"]["_id"],
  		    },
  		    "prefix": "ws",
  		    "host": "server.cocreate.app:8088"
  		}
var event1 = generateUUID();
  		CRUD.connect(socket_config);
  		let eventGetOrg = 'eventGetOrg'
  		CRUD.readDocumentList({
       collection: "organizations",
       is_collection: false,
        operator: {
  				filters: [{
  					name: 'domains',
  					operator: "$in",
  					value: ['server.cocreate.app']
  				}]
        },
        // "async": true,
        "event": event1,
      }, socket_config.config)
      
      console.log("Before Await")
     let data2 = await CRUD.listenAsync(event1);
     
     console.log(data2)
     return data2;

  } catch (error) {
    return null;
  }
}

runFunc().then((data)  => console.log('result -------', data))
        .catch((error) => console.log(error))
