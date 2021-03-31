var express = require('express');
var path = require('path');
var router = express.Router();
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const ClientCapability = require('twilio').jwt.ClientCapability;
const url_twilio = 'https://server.cocreate.app:8088/api_/twilio';
var utils = require("../../utils/utils.js");
var config = require("../../config/config.json");
//const CoCreateCRUD = require("../../core/CoCreate-CRUD.js")
var ServerCrud = require("@cocreate/server-crud/src/index.js");
let collection_name = "testtwilio";

 var getOrgByHostname = async(hostname)=>{
    //1er paso
    var socket_config = {
		    "config": {
		        "apiKey": config["masterDB"]["apiKey"],
		        "securityKey": config["masterDB"]["securityKey"],
		        "organization_Id": config["masterDB"]["_id"],
		    },
		    "prefix": "ws",
		    "host": "server.cocreate.app:8088"
		}
		//query to get Org from MasterDB
		var crudSocket = await ServerCrud.SocketInitAsync(socket_config);
	
				
		var getOrg = await ServerCrud.ReadDocumentListAsync(crudSocket,{
			collection: "organizations",
      operator: {
				filters: [{
					name: 'domains',
					operator: "$in",
					value: [hostname]
				}]
      }
		}, socket_config.config);
		
		//delete coneccion to master or not ?
		if(!getOrg){
		  return null
		}
		//2do paso create conexion con la Org que cumpla las condiciones del dominio
		var org = getOrg["data"]['data'][0]
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
		var crudSocketAsync = await ServerCrud.SocketInitAsync(socket_config);
		var getOrg = await ServerCrud.ReadDocumentListAsync(crudSocketAsync,{
			collection: "organizations",
      operator: {
				filters: [{
					name: '_id',
					operator: "$eq",
					value: [org["_id"].toString()]
				}]
      }
		}, socket_config.config);
		var result = {
		    'row':getOrg["data"]['data'][0],
		    'crudSocketAsync':crudSocketAsync,
		    'socket_config':socket_config
		}
		return result;
}

router.get('/token/:clientName?', async (req, res) => {
  //. Added by Jin
  console.log('call /api/twilio/token/:clientName');

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  try{
    const clientName = (typeof(req.params.clientName) != undefined) ? req.params.clientName : '--';
    let result = await getOrgByHostname(req.hostname);
    let org = result['row']
    console.log(org["apis"]["twilio"])
		const accountId =org["apis"]["twilio"]["twilioAccountId"];
    const authToken = org["apis"]["twilio"]["twilioAuthToken"];
    const accountSid = org["apis"]["twilio"]["accountSid"];
    const capability = new ClientCapability({
      accountSid: accountSid,
      authToken: authToken,
    });
    
    capability.addScope(
      new ClientCapability.OutgoingClientScope({ applicationSid: accountSid })
    );
    capability.addScope(new ClientCapability.IncomingClientScope(clientName));
    const token = capability.toJwt();
    res.set('Content-Type', 'application/jwt');
    
    res.json({
     token: token
    });
    
  }catch(e){
    console.log(e)
    res.json({
     token: 'NoToken'
    });
  }
});

router.post('/listen_record',(req, res)=>{
  let data_original = {...req.body};
  console.log("Listen_recording ",data_original);
});

router.post('/voice', async (req, res) => {
  let { friendlyname } = req.body;
  const twiml = new VoiceResponse();
  let data_original = {...req.body};
  const { opt } = req.body;
  let  dial = '';
  switch (opt) {
    case 'joinConference':
        friendlyname = friendlyname ? friendlyname : 'cocreateDefault'
        dial = twiml.dial();
        dial.conference(friendlyname);
      break;
    case 'queue':
      friendlyname = friendlyname ? friendlyname : 'cocreateDefault'
      twiml.dial().queue(friendlyname);
    break;
    default:
      let from = (data_original.From) ? data_original.From : '+16027372368';
      dial = twiml.dial({ callerId: from });
      dial.number({
          statusCallbackEvent: 'initiated ringing answered completed',
          statusCallback: url_twilio+'/calls_events',
          statusCallbackMethod: 'POST'
      },data_original.To);
      
  }
  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());
});


router.post('/calls_events_conference', async (req, res)=>{
  
  let hostname = req.hostname;
  let data_original = {...req.body};
  var org = 0
  var bd = 'masterDB'
  
       //1er paso
    var socket_config = {
		    "config": {
		        "apiKey": config["masterDB"]["apiKey"],
		        "securityKey": config["masterDB"]["securityKey"],
		        "organization_Id": config["masterDB"]["_id"],
		    },
		    "prefix": "ws",
		    "host": "server.cocreate.app:8088"
		}
		//query to get Org from MasterDB
		var crudSocket = await ServerCrud.SocketInitAsync(socket_config);
		var getOrg = await ServerCrud.ReadDocumentListAsync(crudSocket,{
			collection: "organizations",
      operator: {
				filters: [{
					name: 'domains',
					operator: "$in",
					value: [hostname]
				}]
      }
		}, socket_config.config);
		var org = getOrg["data"]
	  var socket_config = {
		    "config": {
		        "apiKey": org["apiKey"],
		        "securityKey": org["securityKey"],
		        "organization_Id": org["_id"],
		    },
		    "prefix": "ws",
		    "host": "server.cocreate.app:8088"
		}
		var crudSocket = await ServerCrud.SocketInitAsync(socket_config);
		// mas abajo se guardaron objetos del status
    try{
      //org = await utils.getDocumentByQuery({'collection':'organizations','twilioAccountId':data_original['AccountSid']},bd);
      const accountId =org["twilio"]["twilioAccountId"];
      const authToken = org["twilio"]["twilioAuthToken"];
      var twilio = require('twilio')(accountId, authToken);
    }catch(e){
      console.log("Error connect twilio in routes conference")
      return
    }  
	
  
  let callData = {};

  let status = data_original['StatusCallbackEvent'];
  console.log(data_original)
  switch (status) {
    case 'participant-leave':
    case 'conference-end':
      callData = await ServerCrud.ReadDocumentListAsync(crudSocket,{
                      			collection: collection_name,
                             operator: {
                        				fetch: {
                        					name: 'ConferenceSid',
                        					value: data_original["ConferenceSid"]
                        				}
                              }
                        		}, socket_config.config);
      callData = callData["data"]
      const data_parent = await twilio.calls(callData["ParentCallSid"]).fetch()
      if(Object.keys(data_parent).indexOf('from') !== -1 && data_parent['from'].indexOf('client') === -1){
            data_parent["direction"] = 'inbound-dial';
        }else{
            data_parent["direction"] = 'outbound-dial';
        }
      data_original = data_parent;
    break;
    case 'participant-hold':
      data_original['status'] = 'hold-conference';
    break;
    case 'participant-join':
      data_original['status'] = 'hold';
    break;
    case 'participant-speech-start':
      data_original['status'] = 'in-progress-conference';
    break;
  }
  if(data_original['status'] !== 'completed')
  
  ServerCrud.UpdateDocument({
            collection: collection_name,
            data: data_original,
            broadcast_sender: true,
            broadcast: true,
            document_id : callData._id.toString()
          }, socket_config.config);
  
  res.send("holakk")
});

router.post('/calls_events', async (req, res)=>{
  try{
    let data_original = {...req.body}
    let hostname = req.hostname;
    var org = 0
    
    //1er paso
    var socket_config = {
		    "config": {
		        "apiKey": config["masterDB"]["apiKey"],
		        "securityKey": config["masterDB"]["securityKey"],
		        "organization_Id": config["masterDB"]["_id"],
		    },
		    "prefix": "ws",
		    "host": "server.cocreate.app:8088"
		}
		//query to get Org from MasterDB
		var crudSocket = await ServerCrud.SocketInitAsync(socket_config);
				
		var getOrg = await ServerCrud.ReadDocumentListAsync(crudSocket,{
			collection: "organizations",
      operator: {
				filters: [{
					name: 'domains',
					operator: "$in",
					value: [hostname]
				}]
      }
		}, socket_config.config);
		
		//delete coneccion to master or not ?
		if(!getOrg){
		  return
		}
		//2do paso create conexion con la Org que cumpla las condiciones del dominio
		var org = getOrg["data"]['data'][0]
		console.log("ORg ",org)
		console.log("_ID",org["_id"],org._id)
	  var socket_config = {
		    "config": {
		        "apiKey": org["apiKey"],
		        "securityKey": org["securityKey"],
		        "organization_Id": org["_id"].toString(),
		    },
		    "prefix": "ws",
		    "host": "server.cocreate.app:8088"
		}
		var crudSocketAsync = await ServerCrud.SocketInitAsync(socket_config);
		
		var getOrg = await ServerCrud.ReadDocumentListAsync(crudSocketAsync,{
			collection: "organizations",
      operator: {
				filters: [{
					name: '_id',
					operator: "$eq",
					value: [org["_id"].toString()]
				}]
      }
		}, socket_config.config);
		var org = getOrg["data"]['data'][0]
		console.log("ORG...===",org)
		// mas abajo se guardaron objetos del status
    try{
      //org = await utils.getDocumentByQuery({'collection':'organizations','twilioAccountId':data_original['AccountSid']},bd);
      const accountId =org["apis"]["twilio"]["twilioAccountId"];
      const authToken = org["apis"]["twilio"]["twilioAuthToken"];
      var twilio = require('twilio')(accountId, authToken);
    }catch(e){
      console.log("Error connect twilio in routes")
      return
    }  
   
    console.log("=====>>>>> ",org._id.toString())
    let callData = {};
    data_original = {...data_original, organization_id: org._id.toString()};
    let status = data_original['CallStatus']
    const data_parent = await twilio.calls(data_original["ParentCallSid"]).fetch()
    if(Object.keys(data_parent).indexOf('from') !== -1 && data_parent['from'].indexOf('client') === -1){
      data_original["direction"] = data_parent["direction"] = 'inbound-dial';
    }else{
      data_original["direction"] = data_parent["direction"] = 'outbound-dial';
    }
    data_original['status'] = status
    data_parent['status'] = status
    
    console.log("status ------------ ",status)

    switch (status) {
      case 'initiated':
           
            ServerCrud.CreateDocumentAsync(crudSocketAsync,{
              	collection: collection_name,
              	broadcast_sender: true,
              	broadcast: true,
              	data: data_original,
            }, socket_config.config);
            
           

        break;
        
      case 'ringing':
          
            ServerCrud.CreateDocumentAsync(crudSocketAsync,{
              	collection: collection_name,
              	broadcast_sender: true,
              	broadcast: true,
              	data: data_original,
            }, socket_config.config);
            
        break;
        case 'in-progress':
        case 'answered':
         callData = await ServerCrud.ReadDocumentListAsync(crudSocketAsync,{
                      			collection: collection_name,
                             operator: {
                        				fetch: {
                        					name: 'CallSid',
                        					value: data_original["CallSid"]
                        				}
                              }
                        		}, socket_config.config);
      		var crudSocket = await ServerCrud.SocketInit(socket_config);
          ServerCrud.UpdateDocument({
            collection: collection_name,
            data: data_original,
            broadcast_sender: true,
            broadcast: true,
            document_id : callData._id.toString()
          }, socket_config.config);
        break;
        case 'completed':
        case 'busy':
        case 'no-answer':
          /* await sleep(3000)
            function sleep(ms) {
              return new Promise((resolve) => {
                setTimeout(resolve, ms);
              });
            }*/
          console.log("socket_config",socket_config)
          console.log("data_original",data_original)
          callData = await ServerCrud.ReadDocumentListAsync(crudSocketAsync,{
                      			collection: collection_name,
                             operator: {
                        				filters: [{
                        					name: 'CallSid',
                        					operator: "$eq",
                        					value: [data_original["CallSid"]]
                        				}]
                              }
                        		}, socket_config.config);
          console.log("callData ´´´´",callData)
          if(callData == null)
              callData = await ServerCrud.ReadDocumentListAsync(crudSocketAsync,{
                        			collection: collection_name,
                               operator: {
                          				filters: [{
                        					name: 'ParentCallSid',
                        					operator: "$eq",
                        					value: [data_original["ParentCallSid"]]
                        				}]
                                }
                          		}, socket_config.config);
          callData = callData['data']['data'][0]
          console.log(" ... -> ",callData)
          
          let status_update = (callData["status"] !=='hold') ? status : callData["status"];
          data_parent["status"] = status_update;
          data_parent["CallStatus"] = status;
          data_parent["CallSid"] = data_original["CallSid"]
          
          ServerCrud.UpdateDocumentAsync(crudSocketAsync,{
              collection: collection_name,
              data: data_original,
              broadcast_sender: true,
              broadcast: true,
              document_id : callData._id.toString()
          }, socket_config                                                                                                               .config);
            
          break;
    }
  }catch(e){
    console.log("Error en events  ===>>> ",e.toString())
  }
});

router.get('/actions_twiml', (req, res)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  let data_original = {...req.body};
  const { opt , CallSid } = req.query;
  const twiml = new VoiceResponse();
    switch (opt) {
      case 'holdmusic':
          twiml.play('https://server.cocreate.app/CoCreate-components/CoCreate-api-twilio/music/amit12345.mp3');
      break;
      default:
        twiml.say('Hey, Thanks for calling!');
    } 
    //res.send(req.query);
    res.set('Content-Type', 'text/xml');
    res.send(twiml.toString());
})

module.exports = router;