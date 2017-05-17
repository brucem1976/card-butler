//const mongoose = require('mongoose');
//const jwt = require('jsonwebtoken');
//const _ = require('lodash');
//const bcrypt = require('bcryptjs');

//const fs = require('fs');

//var user = JSON.parse(fs.readFileSync("./users.json","utf8"));

/*
var UserSchema = new mongoose.Schema({
   // email: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   minlength: 4,
  //   unique: true,
  //   validate: {
  //     validator: validator.isEmail,
  //     message: '{VALUE} is not a valid email'
  //   }
  // },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
    unique: true
  },
  password: {
    type: String,
    require: true,
    minength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//const validator = require('validator');

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  
  return _.pick(userObject, ['_id', 'name']);
};

UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(),access}, 'abc123').toString();
  
  user.tokens.push({access, token});
  
  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;
  
  return user.update({
    $pull: {
      tokens: {
        token: token
      }
    }
  });
};
// statics creates a model method instead of instance method
UserSchema.statics.findByToken = function (token) {
  var user = this;
  var decoded;
  
  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }
  
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (name, password) {
  var User = this;
  
  return User.findOne({name}).then((user) => {
    if(!user) {
      return Promise.reject();
    }
    
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function(next) {
  var user = this;
  
  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);
*/

// user states:
//  - logged on: they've entered name and password
//  - authorized: once off by the dealer
//  - active: the dealer has enabled them after logging in
//  - connected: the user currently has a socket connected

// The user will be assigned a player number and password registered when 'logged on' which will persist until the dealer or they leave the game totally
// Active means they are 'at the table' and should get cards, they can mark non-active, as can the dealer
// Connected is simply the physical socket connection which comes and goes

// all 3 are required to get cards

var a = {playerNum:-1};
var users = [a,a,a,a,a,a,a,a,a,a,a];
var addUser = (params) => {
  // because users can disconnect, this list can be unordered in terms of player numbers
  // always keep user number x as user x throughout game
  
  // firstly - is this a brand new user? register with password
  // or, is it a socket refresh? If password is correct, delete older socket and allow this one.
  
  for(var i=0; i<users.length; i++) {
    if(params.name === users[i].name) {
      console.log("User already exists!");
      if (params.password === users[i].password) {
        console.log("Password checks out - re-enable user!");
        return i;
      } else {
        console.log("Password fail - deny user!");
        return -1;
      }
    }
  }
  
  // user doesn't exist yet, so let's add them
  for(i=0; i<11; i++) {
    if(users[i].playerNum < 0) {
      users[i] = {playerNum: i, name: params.name, password: params.password};
      console.log(`User ${i}, name ${params.name} has password ${params.password}`);
      return i;
    }
  }
  
  // game is full
  return -1;
};

var removeUser = (name) => {
  // because users can disconnect, this list can be unordered in terms of player numbers
  // make sure user number x remains user number x throughout game

  for(var i=0; i<users.length; i++) {
    if(users[i].name === name) {
      users[i] = {playerNum: -1};
      return i;
    }
  }
  return -1;
};

var removeAllUsers = () => {
  var names = [];
  for(var i=1; i<users.length; i++) {
    if(users[i].playerNum > 0) {
      names.push(users[i].name);
      users[i] = {playerNum: -1};
    }
  }
  return names;
};

module.exports = { users, addUser, removeUser, removeAllUsers };