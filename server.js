// TODO
// figure out __dirname thing
// - get cards fitting right
// - double click to toggle - front/back of cards
// - press and hold to show cards, release to hide
// idea - display flop, turn, river
// idea - your best hand, on ranking

const port = process.env.PORT || 3000;

// express npm: efficient async server handler
const express = require('express');
// handlebars from npm: partials and helpers
const hbs = require('hbs');
// for shuffle
const _ = require('lodash');
const fs = require('fs');

const cardValue = ['ace','2','3','4','5','6','7','8','9','10','jack','queen','king'];
const cardSuit = ['clubs','diamonds','hearts','spades'];


//create the server
var app = express();
app.set('view engine', 'hbs');

// allow all html's in /public to be loaded
app.use(express.static(__dirname + '/public'));

var users = JSON.parse(fs.readFileSync("./users.json","utf8"));

// empty strings match to the graphic for the back of card
var getCardSuit = (i) => {
  if(numVisibleCards > i) return card[i].suit;
  return "";
};

// empty strings match to the graphic for the back of card
var getCardValue = (i) => {
  if(numVisibleCards > i) return card[i].value;
  return "";
};

hbs.registerHelper('getCardNumber', (i,j) => {
  //console.log(`${i} =-=-= ${j}`);
  return (i*2) + j;
});

hbs.registerHelper('getCardImage', (i,width) => {
  var str = "";
  str += '<img width="'
  str += width;
  str += '" max-height="100%" src="';
  str += "/images/cards/";
  str += getCardValue(i);
  str += '_of_';
  str += getCardSuit(i);
  str += '.svg" alt="card';
  str += i+1;
  str += '" />';
  //console.log(`cardimage for card: ${i}`);
  return new hbs.SafeString(str);
});

// just numbers 0-51, representing the card number in the pack
var cardArray = [];
for(var i=0; i<52; i++) {
  cardArray[i] = i;
}

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

// state - 0=deal, 1=flop, 2=turn, 3=river
var state = -1;
// card object array - each has a value, and a suit
var card = [];
// cards visible to play in each state (for 10 players)
var numCards = [20,23,24,25];
// how many cards should currently be visible?
var numVisibleCards = 0;

for(var i=0; i<users.length; i++) {
  var route = `/${users[i].accessCode}`;
  //app.get(route, (req, res, i) => rend(req,res,i));
  app.get(route, makeHandler(i));
}

function makeHandler(i) {
  return function(req, res) {
     // copy body of handler function here
    if(!i) state++;
    if(state>3) {
      state = 0;
    }
    
    numVisibleCards = numCards[state];
    if((state === 0)&&(!i)) {
      cardArray = _.shuffle(cardArray);
      card = [];
    
      for(var j=0; j<25; j++) {
        card.push({
          value : cardValue[Math.floor(cardArray[j])%13],
          suit : cardSuit[Math.floor(cardArray[j]/13)]
        });
      }
    }
    
    
    
    
    
    res.render('index.hbs', {
      i
    });
  };
}
