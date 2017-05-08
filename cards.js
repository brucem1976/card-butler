var Hand = require('pokersolver').Hand;
const cardValue = ['ace','2','3','4','5','6','7','8','9','10','jack','queen','king'];
const cardSuit = ['clubs','diamonds','hearts','spades'];
const rankValue = ['A','2','3','4','5','6','7','8','9','T','J','Q','K'];
const rankSuit = ['c','d','h','s'];
// for shuffle
const _ = require('lodash');


// state - 0=deal, 1=flop, 2=turn, 3=river
var state = -1;
// card object array - each has a value, and a suit
var card = [];
// cards visible to play in each state (for 10 players)
var numCards = [20,23,24,25];
// how many cards should currently be visible?
var numVisibleCards = 0;

// just numbers 0-51, representing the card number in the pack
var cardArray = [];
for(var i=0; i<52; i++) {
  cardArray[i] = i;
}

var advanceState = () => {
   state++;
    if(state>3) {
      state = 0;
    }
    
    numVisibleCards = numCards[state];
    if(state === 0) {
      cardArray = _.shuffle(cardArray);
      card = [];
    
      for(var j=0; j<25; j++) {
        card.push({
          value : cardValue[Math.floor(cardArray[j])%13],
          suit : cardSuit[Math.floor(cardArray[j]/13)],
          rank : rankValue[Math.floor(cardArray[j])%13]+rankSuit[Math.floor(cardArray[j]/13)]
        });
      }
    }
};

var getRank = (i) => {
  var cRank = [card[i*2].rank,card[i*2+1].rank];
  if(numVisibleCards>=23) {
    cRank.push(card[20].rank);
    cRank.push(card[21].rank);
    cRank.push(card[22].rank);
  }
  if(numVisibleCards>=24) {
    cRank.push(card[23].rank);
  }
  if(numVisibleCards>=25) {
    cRank.push(card[24].rank);
  }
  
  var hand = Hand.solve(cRank);
  
  return hand.descr;
};

var getCardImage = (p,i) => {
  var width = "125px";
  if((p>0)&&(i>19)) {
    width = "50px";
  }
  
  if(i<20) {
    i += (p-1)*2;
  }
  
  var str = "";
  str += '<img width="';
  str += width;
  str += '" max-height="100%" src="';
  str += "/images/cards/";
  str += getCardValue(i);
  str += '_of_';
  str += getCardSuit(i);
  str += '.svg" alt="card';
  str += i+1;
  str += '" />';
  return str;
};

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

module.exports = {
  advanceState,
  getRank,
  getCardImage
};

