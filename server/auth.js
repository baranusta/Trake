var express = require('express');
var bodyParser = require('body-parser');

var logger = require('./logger.js');
  
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/pusher/auth', function(req, res) {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var auth = pusher.authenticate(socketId, channel);
  logger.info('Hello again distributed again distributed again distributed again distributed again distributed logs');
  res.send(auth);
});

var port = process.env.PORT || 5000;
app.listen(port);
