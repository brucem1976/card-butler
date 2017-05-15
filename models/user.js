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

var users = [];
var addUser = (socketID,name) => {
  // because users can disconnect, this list can be unordered in terms of player numbers
  for(var i=0; i<users.length; i++) {
    if(name === users[i].name) {
      console.log("User already exists!");
      return -1;
    }
  }

  for(var i=0; i<11; i++) {
    var matched = false;
    for(var j=0; j<users.length; j++) {
      if(users[j].playerNum === i) {
        matched = true;
        break;
      }
    }
    if(!matched) {
      users.push({playerNum: i, socketID: socketID, name:name});
      console.log(`User ${i}, name ${name} has socket ${socketID}`);
      return i;
    }
  }
  return -1;
};

var removeUser = (socketID) => {
  // because users can disconnect, this list can be unordered in terms of player numbers

  for(var i=0; i<users.length; i++) {
    if(users[i].socketID === socketID) {
      users.splice(i,1);
      return i;
    }
  }
  return -1;
};
module.exports = { users, addUser, removeUser };