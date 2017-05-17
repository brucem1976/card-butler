// TODO
// use post, not get + url
// use middleware to handle multi users, not multi handlers
// - double click to toggle - front/back of cards
// - press and hold to show cards, release to hide

const port = process.env.PORT || 3000;

const _ = require('lodash');
// to neatly handle relative directiories
const path = require('path');
// to tie express and socket together
const http = require('http');
// express npm: efficient async server handler
const express = require('express');
// for realtime client<->server comms
const socketIO = require('socket.io');
// handlebars from npm: partials and helpers
//const hbs = require('hbs');
//const bodyParser = require('body-parser');

//var {ObjectID} = require('mongodb');
var users = require('../models/user');
//var {mongoose} = require('../db/mongoose.js');
//var {authenticate} = require('../middleware/authenticate');

const cards = require('../cards');

const publicPath = path.join(__dirname, '../public');

//create the server
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

//app.set('view engine', 'hbs');

// allow all html's in /public to be loaded
app.use(express.static(publicPath));

// hbs.registerHelper('getRank', (i) => {
//   return cards.getRank(i);
// });

// hbs.registerHelper('getCardImage', (p,i) => {
//   return new hbs.SafeString(cards.getCardImage(p,i));
// });

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

// json for getting body elements
//app.use(bodyParser.json());

/*
// POST to create new users (Crud)
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['name','password']);
  var user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['name','password']);
  
  User.findByCredentials(body.name, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
    
  });
});

// GET to read users (cRud)
app.get('/users', (req, res) => {
  User.find().then((users) => {
    res.send({users});
  }, (e) => {
    res.status(400).send(e);
  });
});

// PATCH to update users (crUd)
app.patch('/users/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['name', 'password']);
  
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  
    User.findByIdAndUpdate(id, {$set: body}, {new: true}).then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      
      res.send({user});
    }).catch((e) => {
      res.status(400).send();
    });
});

// DELETE to delete a user (cruD)
app.delete('/users/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  
  User.findByIdAndRemove(id).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    
    res.send(user);
  }).catch((e) => {
    res.status(400).send();
  });
});
*/

  // var user = [999,1,2,3,4,5,6,7,8,9,10];
  
  // for(var i=0; i<user.length; i++) {
  //   var route = `/${user[i]}`;
  //   app.get(route, makeHandler(i));
  //   console.log(route);
  // }


// function makeHandler(i) {
//   return function(req, res) {
//     //if(!i) {
//       //var s = cards.advanceState();
//       //io.emit('newCard',s);
//     //}
     
//     // res.render('index.hbs', {
//     //   i
//     // });
//   };
// }

var dealerUser = {name: 'Dealer', password: 'd961979d229805a84587b021473b3c78f03e6b175592deefff357110dfeed9a4800abd271b9a08fe31264fde594ab6cdca54821e93e7b64db7cd857990c5ce15'};
users.addUser(dealerUser);
cards.advanceState();

// process:
// - user presented login page: enter details
// - submit causes client to store password, and send loginRequest with name, password, socket.id
// - server reserves an array space for the user if possible. If user already exists, current one is sent back to login page, and new one takes over
// - dealer is now required to authorise the new player
// - upon success, the user is marked as active, and connection with socket
// - every time the client requests cards, or advanced state, sends password for check
// - buttons to mark as active/inactive
// - button to log out entirely

io.on('connection', (socket) => {
  console.log('New user connected');
  console.log(socket.id);

  socket.on('join', (params, callback) => {
  // might be connecting new user, or reconnecting existing
  var playerNo = users.addUser(params);
  if(playerNo < 0) {
      callback("Couldn't create new user!");
  } else {
    callback();
    socket.emit('connectSuccess', playerNo);
    io.emit('updateUsers',users);
  }
});
  
  socket.on('disconnect', () => {
    console.log("Client disconnected");
    // var rem = users.removeUser(socket.id);
    // if(rem >= 0) {
    //   console.log("Removed user: ", rem);
    // }
  });
  
  socket.on('requestCards', (data) => {
    // here we need to ensure the user is asking on the most recent socket: otherwise send them back to log in???
    console.log('Cards requested by player ',data.playerNum);
    console.log(socket.id);
    var s = cards.giveMyCards(data.playerNum);
    socket.emit('latestCards',s);
    //res.render('index.hbs', 0);
  });
  
  socket.on('advanceState', () => {
    console.log("Dealer requested next card/s");
    var s = cards.advanceState();
    io.emit('newState',s);
    //res.render('index.hbs', 0);
  });
  
  socket.on('endGame', () => {
    var names = users.removeAllUsers();
    for(var i=0; i<names.length; i++) {
      io.emit('leftGame',names[i]);
    }
    io.emit('updateUsers',users);
  });
  
  socket.on('leaveGame', (pName) => {
    users.removeUser(pName);
    io.emit('leftGame',pName);
    io.emit('updateUsers',users);
    //res.render('index.hbs', 0);
  });
  
});

