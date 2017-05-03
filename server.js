// TODO
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

const cardValue = ['ace','2','3','4','5','6','7','8','9','10','jack','queen','king'];
const cardSuit = ['clubs','diamonds','hearts','spades'];

//create the server
var app = express();
app.set('view engine', 'hbs');

// allow all html's in /public to be loaded
app.use(express.static(__dirname + '/public'));

var cardArray = [];
for(var i=0; i<52; i++) {
  cardArray[i] = i;
}

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

var state = 0;
var card = [];
var numCards = [2,5,6,7];

app.get('/', (req, res) => {
  var cards = numCards[state];
  if(state === 0) {
    cardArray = _.shuffle(cardArray);
    card = [];
  
    for(var i=0; i<7; i++) {
      card.push({
        value : cardValue[Math.floor(cardArray[i])%13],
        suit : cardSuit[Math.floor(cardArray[i]/13)]
      });
    }
  }
  
  switch(state) {
    case 0:
      console.log("Deal!");
      break;
    case 1:
      console.log("Flop!");
      break;
    case 2:
      console.log("Turn!");
      break;
    case 3:
      console.log("River!");
      break;
  }
  
  state++;
  if(state>3) {
    state = 0;
  }
  
  var passVals = [];
  for(i=0; i<7; i++) {
      passVals.push({value:"",suit:""});
    }
    
  for(i=0; i<cards; i++) {
      passVals[i].value = card[i].value;
      passVals[i].suit = card[i].suit;
    }
    
    console.log(JSON.stringify(card));
    console.log(JSON.stringify(passVals));
    
  // card.push({
    // value : cardValue[Math.floor(cardArray[1])%13],
    // suit : cardSuit[Math.floor(cardArray[1]/13)]
  // });

  //console.log(`${card[0].value} - ${card[1].suit}`);

  res.render('index.hbs', {
    value1: passVals[0].value,
    suit1: passVals[0].suit,
    value2: passVals[1].value,
    suit2: passVals[1].suit,
    value3: passVals[2].value,
    suit3: passVals[2].suit,
    value4: passVals[3].value,
    suit4: passVals[3].suit,
    value5: passVals[4].value,
    suit5: passVals[4].suit,
    value6: passVals[5].value,
    suit6: passVals[5].suit,
    value7:passVals[6].value,
    suit7: passVals[6].suit
  });
});