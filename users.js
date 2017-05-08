const fs = require('fs');
var users = JSON.parse(fs.readFileSync("./users.json","utf8"));

module.exports = users;