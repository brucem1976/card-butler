var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newCard', function(s) {
  console.log('New Card Played, state ', s);
  location.reload();
});


$(document).ready(function() {
  jQuery("#btn-next-card").on("click", function (e) {
    e.preventDefault();
    console.log('We got clickage!');
    socket.emit('requestCard');
  });
});
