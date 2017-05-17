var pNum = -1;
var pName = "";
var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
  var params = jQuery.deparam(window.location.search);
  console.log("User name: ",params.name);
  pName = params.name;
  socket.emit('join', params, function (err) {
    if(err) {
      alert(err);
      window.location.href = '/';
    } else {
      
    }
  });
});

socket.on('connectSuccess', function (playerNum) {
  console.log("Assigned player", playerNum);
  pNum = playerNum;
  var titleString = pNum + ": " + pName + " | PokerTable";
  $(document).prop('title', titleString);
    socket.emit('requestCards',{playerNum:playerNum});
    if(playerNum === 0) {
      $("#pocket-cards").attr("style","display: none;");
      $("#card3").attr("width","125px");
      $("#card4").attr("width","125px");
      $("#card5").attr("width","125px");
      $("#card6").attr("width","125px");
      $("#card7").attr("width","125px");
      $("#ranks").attr("style","display: none;");
    } else {
      $("#btn-next-card").attr("style","display: none;");
      $(".pbuttons").attr("style","display: none;");
      
    }
  //location.reload();
});

socket.on('updateUsers', function(users) {
  console.log("Got new user list: ", users);
  if(pNum) {
    return;
  }
  for(var i=1; i<11; i++) {
      var btnTgt = "#btn-p" + i;
      $(btnTgt).text("[Empty]");
      $(btnTgt).attr("style","display: none;");
      
    }
  for(var i=1; i<11; i++) {
    if(users.users[i].playerNum > 0) {
      var btnTgt = "#btn-p" + users.users[i].playerNum;
      $(btnTgt).text(users.users[i].name);
      $(btnTgt).attr("style","display: inline;");
      console.log("Button target: ", btnTgt, " value: ", users.users[i].name);
    }
  }
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('leftGame', function(name) {
  console.log('Left the game');
  if(pName === name) {
    window.location.href = '/';
  }
});

socket.on('newState', function(s) {
  console.log('New State Updated: ', s);
  //$("#card1").attr("src","/images/cards/ace_of_spades.svg");
  socket.emit('requestCards',{playerNum:pNum});
  //location.reload();
});

socket.on('latestCards', function(cards) {
  console.log('Cards received: ', cards);
  var cardstrings = [];
  for(var i=0; i<7; i++) {
    cardstrings.push("/images/cards/" + cards[i]);
  }
  $("#card1").attr("src",cardstrings[0]);
  $("#card2").attr("src",cardstrings[1]);
  $("#card3").attr("src",cardstrings[2]);
  $("#card4").attr("src",cardstrings[3]);
  $("#card5").attr("src",cardstrings[4]);
  $("#card6").attr("src",cardstrings[5]);
  $("#card7").attr("src",cardstrings[6]);
  $("#ranking").text(cards[7]);
  
  console.log(cards[7]);
});


$(document).ready(function() {
  jQuery("#btn-next-card").on("click", function (e) {
    e.preventDefault();
    socket.emit('advanceState');
  });
  
  jQuery("#btn-end-game").on("click", function (e) {
    e.preventDefault();
    console.log('We got clickage!');
    socket.emit('endGame',pName);
  });
  
  jQuery(".pbuttons").on("click", function (e) {
    e.preventDefault();
    console.log('We got clickage!');
    
    socket.emit('leaveGame',$(this).text());
  });
});

// window.onbeforeunload = function () {
//   return "Do you really want to close?";
// };

