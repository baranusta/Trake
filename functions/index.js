const functions = require('firebase-functions');
var logger = require('./server/logger.js');

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const Pusher = require('pusher')
const crypto = require('crypto')
const cors = require("cors")

var rooms = {};
var users = {};

//Dev
var pusher = new Pusher({
  appId: '453933',
  key: '17e4a8e6fe75db393468',
  secret: 'ec2e4e06734d6a8cf28d',
  cluster: 'eu',
  encrypted: true
});

//Production
// var pusher = new Pusher({
//   appId: '453935',
//   key: '31575cc8f2fac1cc44a0',
//   secret: 'f9d3f772fc762ad39c41',
//   cluster: 'eu',
//   encrypted: true
// });
// // Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({ origin: true }));


var checkCreateRoomParameters = function (req) {
  return true;
}

var checkRoomPlayerChangeParameters = function (req) {
  return true;
}

var checkCreateUserParameters = function (req) {
  return true;
}

// // API route used by Pusher as a way of authenticating users
app.post('/auth', (req, res) => {
  if(users.length > 30)
  {
    res.status(403).end();
    return;
  }

  var presenceData = {
    user_id: crypto.randomBytes(16).toString('hex'),
    user_info: {
      name: req.body.name
    }
  };
  let socketId = req.body.socket_id
  let channel = req.body.channel_name
  logger.info(req.body);
  var auth = pusher.authenticate(
    req.body.socket_id,
    req.body.channel_name,
    presenceData
  );
  res.status(200).send(auth);
})


app.get('/rooms', (req, res) => {
  logger.info(rooms);
  res.send(rooms);
})

app.post('/createRoom', (req, res) => {
  if (rooms.hasOwnProperty(req.body.name)) {
    res.status(403).end();
  }
  else {
    if (!checkCreateRoomParameters(req.body)) {
      res.status(400).end();
      return;
    }
    rooms[req.body.name] = req.body;
    res.status(200).end();
  }
  logger.info(rooms);
})

app.post('/deleteUser', (req, res) => {
  var userName = req.body.name;
  if (users.hasOwnProperty(userName)) {
    var createdRoom;
    for (var roomName in rooms) {
      if (rooms.hasOwnProperty(roomName) && 
          rooms[roomName].hasOwnProperty("createdBy") && 
          rooms[roomName].createdBy == userName) {
        createdRoom = roomName;
        break;
      }
    }
    if (!!createdRoom) {
      delete rooms[createdRoom];
    }
    else if(!!users[userName].room){
      rooms[users[userName].room].joined -= 1;
    }
    delete users[userName];
  }
  logger.info(users);
  res.sendStatus(200);
})

app.post('/createUser', (req, res) => {
  if (Object.keys(users).length >= 50 || users.hasOwnProperty(req.body.name)) {
    res.status(403).end();
  }
  else {
    if (!checkCreateUserParameters(req.body)) {
      res.status(400).end();
      return;
    }
    users[req.body.name] = req.body.name;
    res.status(200).end();
  }
  logger.info(users);
})

app.post('/joinRoom', (req, res) => {
  if (!rooms.hasOwnProperty(req.body.roomName)) {
    res.status(400).end();
  }
  else {
    if (!checkRoomPlayerChangeParameters(req.body)) {
      res.status(400).end();
      return;
    }
    if (rooms[req.body.roomName].joined > rooms[req.body.roomName].playerLimit) {
      res.status(400).end();
      return;
    }
    users[req.body.playerName].room = req.body.roomName;
    rooms[req.body.roomName].joined += 1;
    res.sendStatus(200);
  }
  logger.info(rooms);
})

app.post('/leaveRoom', (req, res) => {
  if (!rooms.hasOwnProperty(req.body.name)) {
    res.status(400).end();
  }
  else {
    if (!checkRoomPlayerChangeParameters(req.body)) {
      res.status(400).end();
      return;
    }
    rooms[req.body.name].joined -= 1;
    if (rooms[req.body.name].joined == 0) {
      delete rooms[req.body.name];
    }
    res.status(200).end();
  }
  logger.info(rooms);
})


// Set port to be used by Node.js
app.set('port', (process.env.port || 8000))

app.listen(app.get('port'), () => {
  logger.info('Started.');
})
exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
