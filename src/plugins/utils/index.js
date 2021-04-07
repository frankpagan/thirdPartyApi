
var send_response=(wsManager,socket,obj,send_response)=>{
  console.log("Response   TO-> "+send_response)
  wsManager.send(socket, send_response, obj)
}

var handleError=(wsManager,socket, type, error,module_id) =>{
    const response = {
      'object': 'error',
      'data':error || error.response || error.response.data || error.response.body || error.message || error,
    };
    send_response(wsManager, socket, { type, response }, module_id);
}

module.exports.send_response = send_response;
module.exports.handleError = handleError;