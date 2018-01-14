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

var pusher = new Pusher({
  appId: '453933',
  key: '17e4a8e6fe75db393468',
  secret: 'ec2e4e06734d6a8cf28d',
  cluster: 'eu',
  encrypted: true
});

// // Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({origin:true}));

// Index API route for the Express app
// app.get('/', (req, res) => {
//   res.sendFile('index.html');
// })

app.get('/rooms', (req, res) => {
  logger.info(rooms);
  res.send(rooms);
})

var checkCreateRoomParameters = function(req)
{
  return true;
}

var checkJoinRoomParameters = function(req)
{
  return true;
}

var checkCreateUserParameters = function(req)
{
  return true;
}

app.post('/createRoom', (req, res) => {
  if (rooms.hasOwnProperty(req.body.name)) {
    res.sendStatus(403);
  }
  else {
    if(!checkCreateRoomParameters(req.body))
    {
      res.sendStatus(400);
      return;
    }

    req.body.joined = 1;
    pusher.trigger('lobby', 'room-added', req.body);
    logger.info(req.body.name);
    rooms[req.body.name] = req.body;
    res.sendStatus(200);
  }
  logger.info(rooms);
})

app.post('/deleteUser', (req, res) => {
  if (users.hasOwnProperty(req.body.name)) {
    delete users[req.body.name];
  }
  logger.info(users);
  res.sendStatus(200);
})

app.post('/createUser', (req, res) => {
  if (Object.keys(users).length >= 50 || users.hasOwnProperty(req.body.name)) {
    res.sendStatus(403);
  }
  else {
    if(!checkCreateUserParameters(req.body))
    {
      res.sendStatus(400);
      return;
    }
    users[req.body.name] = req.body.name;
    res.sendStatus(200);
  }
  logger.info(users);
})

app.post('/joinRoom', (req, res) => {
  if (!rooms.hasOwnProperty(req.body.name)) {
    res.sendStatus(400);
  }
  else {
    if(!checkJoinRoomParameters(req.body))
    {
      res.sendStatus(400);
      return;
    }
    if(rooms[req.body.name].joined > rooms[req.body.name].playerCount)
    {
      res.sendStatus(400);
      return;
    }
    rooms[req.body.name].joined += 1;
    pusher.trigger('lobby', 'room-joined', rooms[req.body.name]);
    pusher.trigger('presence-' + req.body.name, joined, {name:req.body.playerName})
    var data = req.body;
    data.id = rooms[req.body.name].joined;
    res.end(JSON.stringify({id:data.id}));
  }
  logger.info(rooms);
})

// // API route used by Pusher as a way of authenticating users
app.post('/pusher/auth', (req, res) => {
  let socketId = req.body.socket_id
  let channel = req.body.channel_name
  // Generate a random string and use as presence channel user_id
  let presenceData = {
    user_id: crypto.randomBytes(16).toString('hex')
  }
  logger.info(req.body);
  let auth = pusher.authenticate(socketId, channel, presenceData)
  res.send(auth)
})

// Set port to be used by Node.js
app.set('port', (process.env.port||8000))

app.listen(app.get('port'), () => {
  logger.info('Started.');
})


pusher.trigger('presence-my-channel', 'my-event', {
  "message": "hello worldsel"
});
pusher.trigger('lobby', 'my-event', {
  "message": "hello world"
});

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
