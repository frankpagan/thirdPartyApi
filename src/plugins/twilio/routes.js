var express = require('express');
var path = require('path');
var router = express.Router();
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const ClientCapability = require('twilio').jwt.ClientCapability;
const url_twilio = 'https://server.cocreate.app:8088/api_/twilio';
let collection_name = "testtwilio";
let enviroment_twilio_default = 'test'

const { getOrg, getOrgInRoutesbyHostname } = require("../../utils/crud.js");

router.get('/test_crud2', async (req, res) => {
   let org = await getOrgInRoutesbyHostname(req.hostname);
   console.log(org["data"])
   res.send({"org":org});
});


router.get('/token/:clientName?', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  try{
    let data_original = {...req.query};
    const clientName = (typeof(req.params.clientName) != undefined) ? req.params.clientName : '--';
	 let org = await getOrgInRoutesbyHostname(req.hostname);
    org = org["row"]["data"][0];
    let enviroment = typeof data_original['enviroment'] != 'undefined' ? data_original['enviroment'] : enviroment_twilio_default;
		const accountSid =org["apis"]["twilio"][enviroment]["twilioAccountId"];
    const authToken = org["apis"]["twilio"][enviroment]["twilioAuthToken"];
    const appSid = org["apis"]["twilio"][enviroment]["twilioAccountSid"];

    const capability = new ClientCapability({
      accountSid: accountSid,
      authToken: authToken,
    });
    capability.addScope(
      new ClientCapability.OutgoingClientScope({ applicationSid: appSid })
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
  console.log("Voice ",req.body)
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
      if(data_original.To.indexOf('+')!=-1)
          dial.number({
              statusCallbackEvent: 'initiated ringing answered completed',
              statusCallback: url_twilio+'/calls_events',
              statusCallbackMethod: 'POST'
          },data_original.To);
      else
        dial.client({
            statusCallbackEvent: 'initiated ringing answered completed',
            statusCallback: url_twilio+'/calls_events',
            statusCallbackMethod: 'POST'
        },data_original.To);
      
  }j
  res.set('Content-Type', 'text/xml');
  res.send(twiml.toString());
});


router.post('/calls_events_conference', async (req, res)=>{
    let data_original = {...req.body};
    let org = await getOrgInRoutesbyHostname(req.hostname);
   	let socket_config = org["socket_config"];
   	org = org["row"]["data"][0];
    try{
      let enviroment = typeof data_original['enviroment'] != 'undefined' ? data_original['enviroment'] : enviroment_twilio_default;
      const accountId =org["apis"]["twilio"][enviroment]["twilioAccountId"];
      const authToken = org["apis"]["twilio"][enviroment]["twilioAuthToken"];
      var twilio = require('twilio')(accountId, authToken);
    }catch(e){
      console.log("Error connect twilio in routes conference")
      return
    }  
      let callData = {};
      let call_sid = data_original["CallSidEndingConference"] ? data_original["CallSidEndingConference"] : data_original["CallSid"]
      crud.readDocumentList({
                      			collection: collection_name,
                             operator: {
                        				filters: [{
                        					name: 'ParentCallSid',
                        					operator: "$eq",
                        					value: [call_sid]
                        				}]
                              },
                              "event": "getCall",
                        		}, socket_config.config);
      callData = await crud.listenAsync("getCall");
      callData = callData["data"][0];
  let status = data_original['StatusCallbackEvent'];
  switch (status) {
    case 'participant-leave':
    case 'conference-end':
      if (typeof(callData) != 'undefined' &&   Object.keys(callData).length){
          const data_parent = await twilio.calls(callData["ParentCallSid"]).fetch()
          if(Object.keys(data_parent).indexOf('from') !== -1 && data_parent['from'].indexOf('client') === -1){
                data_parent["direction"] = 'inbound-dial';
            }else{
                data_parent["direction"] = 'outbound-dial';
            }
            data_original = data_parent;
      }
      data_original['status'] = 'completed';
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
   // if(data_original['status'] !== 'completed')
  if(callData != null && Object.keys(callData).length){
      crud.updateDocument({
                collection: collection_name,
                data: data_original,
                broadcast_sender: true,
                broadcast: true,
                document_id : callData._id.toString()
              }, socket_config.config);
        }
        res.send("holakk")
});

router.post('/calls_events', async (req, res)=>{
  try{
    let data_original = {...req.body}
   	let org = await getOrgInRoutesbyHostname(req.hostname);
   	let socket_config = org["socket_config"];
    org = org["row"]["data"][0];
    try{
      let enviroment = typeof data_original['enviroment'] != 'undefined' ? data_original['enviroment'] : enviroment_twilio_default;
      const accountId =org["apis"]["twilio"][enviroment]["twilioAccountId"];
      const authToken = org["apis"]["twilio"][enviroment]["twilioAuthToken"];
      var twilio = require('twilio')(accountId, authToken);
    }catch(e){
      console.log("Error connect twilio in routes")
      return
    }  
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
    switch (status) {
      case 'ringing':
            crud.createDocument({
              	collection: collection_name,
              	broadcast_sender: true,
              	broadcast: true,
              	data: data_original,
            }, socket_config.config);
        break;
        case 'in-progress':
        case 'answered':
          crud.readDocumentList({
                      			collection: collection_name,
                             operator: {
                        				fetch: {
                        					name: 'CallSid',
                        					value: data_original["CallSid"]
                        				}
                              },
                              "event": "getCall",
                        		}, socket_config.config);
          callData = await crud.listenAsync("getCall");
          callData = callData["data"][0];
          crud.updateDocument({
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
           crud.readDocumentList({
                collection: collection_name,
                operator: {
            				filters: [{
            					name: 'CallSid',
            					operator: "$eq",
            					value: [data_original["CallSid"]]
            				}]
                 },
                "event": "getCall",
        		}, socket_config.config);
          callData = await crud.listenAsync("getCall");
          callData = callData["data"][0];
          if(callData == null){
                  crud.readDocumentList({
                      			collection: collection_name,
                             operator: {
                        				filters: [{
                        					name: 'CallSid',
                        					operator: "$eq",
                        					value: [data_original["ParentCallSid"]]
                        				}]
                              },
                              "event": "getCallbyParent",
                        		}, socket_config.config);
              callData = await crud.listenAsync("getCallbyParent");
              callData = callData["data"][0];
          }
          let status_update = (callData["status"] !=='hold') ? status : callData["status"];
          if(callData["status"] !=='hold'){
              data_parent["status"] = status_update;
              data_parent["CallStatus"] = status;
              data_parent["CallSid"] = data_original["CallSid"]
              
              crud.updateDocument({
                  collection: collection_name,
                  data: data_original,
                  broadcast_sender: true,
                  broadcast: true,
                  document_id : callData._id.toString()
              }, socket_config.config);
          }
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
          twiml.play('https://server.cocreate.app/CoCreate-plugins/CoCreate-twilio/music/amit12345.mp3');
      break;
      default:
        twiml.say('Hey, Thanks for calling!');
    } 
    //res.send(req.query);
    res.set('Content-Type', 'text/xml');
    res.send(twiml.toString());
})

module.exports = router;