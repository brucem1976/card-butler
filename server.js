// TODO
// use post, not get + url
// use middleware to handle multi users, not multi handlers
// - double click to toggle - front/back of cards
// - press and hold to show cards, release to hide

const port = process.env.PORT || 3000;

// express npm: efficient async server handler
const express = require('express');
// handlebars from npm: partials and helpers
const hbs = require('hbs');

const cards = require('./cards');

const users = require('./users');

//create the server
var app = express();
app.set('view engine', 'hbs');

// allow all html's in /public to be loaded
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getRank', (i) => {
  return cards.getRank(i);
});

hbs.registerHelper('getCardImage', (p,i) => {
  return new hbs.SafeString(cards.getCardImage(p,i));
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

for(var i=0; i<users.length; i++) {
  var route = `/${users[i].accessCode}`;
  app.get(route, makeHandler(i));
}

function makeHandler(i) {
  return function(req, res) {
    if(!i) {
      cards.advanceState();
    }
     
    res.render('index.hbs', {
      i
    });
  };
}
