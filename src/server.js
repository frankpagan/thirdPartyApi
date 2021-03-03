'use strict';

const express = require('express');
const { createServer } = require('http');
const init = require("./init")
const WSManager = require("./core/WSManager");
const urlencoded = require('body-parser').urlencoded;

const app = express();

const port = process.env.PORT || 8082;
app.use(urlencoded({ extended: false }));
const wsManager = new WSManager('api');

app.use('/twilio', require('./plugins/twilio/routes'));

init.WSManager(wsManager);

const server = createServer(app);

server.on('upgrade', function upgrade(request, socket, head) {
  if (!wsManager.handleUpgrade(request, socket, head)) {
    socket.destroy();
  }
});

server.listen(port);