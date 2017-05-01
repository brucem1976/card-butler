// TODO
// - get cards fitting right
// - double click to toggle - front/back of cards
// - press and hold to show cards, release to hide


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

app.get('/', (req, res) => {
  cardArray = _.shuffle(cardArray);
  var card = [];
  
  card.push({
    value : cardValue[Math.floor(cardArray[0])%13],
    suit : cardSuit[Math.floor(cardArray[0]/13)]
  });

  card.push({
    value : cardValue[Math.floor(cardArray[1])%13],
    suit : cardSuit[Math.floor(cardArray[1]/13)]
  });

  console.log(`${card[0].value} - ${card[1].suit}`);

  res.render('index.hbs', {
    value1: card[0].value,
    suit1: card[0].suit,
    value2: card[1].value,
    suit2: card[1].suit
  });
});