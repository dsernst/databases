var room = "lobby";
var friends = {};
var serverUrl = 'http://127.0.0.1:3000/';

var sanitize = function(string){
  if (typeof string === "string") {
    var sanitized = string;
    sanitized = encodeURI(sanitized);
    sanitized = sanitized.replace(/%20/g, " ");
    if (sanitized !== string) {
      sanitized = "*sanitized*";
    }
    return sanitized
  }
};

var sanitizeObj = function(object) {
  for(keys in object){
    object[keys] = sanitize(object[keys]);
  }
};

var display = function () {
  console.log("inside display function")
  $.get(serverUrl + "classes/messages/",
    {"where": {"roomname": room}, order: "-createdAt", limit: 100},
    function (data) {
      console.log('what the client sees',data)
      $('.chat').html('');
      for (var i = 0; i < data.results.length; i++) {
        var $li = $("<li>");
        $(".chat").prepend($li);
        sanitizeObj(data.results[i]);
        var username = data.results[i].username;
        var msg = data.results[i].text;
        var time = moment(+data.results[i].createdAt).fromNow();
        if (friends[username]) {
          $li.addClass("friend");
        }
        $li.append("<span class = 'username'>" + username + "</span>");
        $li.append("<span class = 'msg'>" + msg + "</span>");
        $li.append("<span class = 'time'>" + time + "</span>");
      };

      if (newRoom) {
        $('.chat').scrollTop( 9000 );
        newRoom = false;
      }

      $('.username').on('click', function(e) {
        var username = e.target.innerText;
        if (!friends[username]) {
          var $li = $("<li>");
          $(".friendslist ul").append($li);
          $li.text(username);
          friends[username] = true;
          $(".friendslist li").tooltip({
            items: "li",
            content: 'loading...',
            track: true,
            open: function() {
              var element = $(this);
              console.log(element.text());
              $.get(serverUrl + "classes/messages/",
                {where: {'username': element.text()}, limit: 1, order: "-createdAt"},
                function (data) {
                  var last = data.results[0];
                  if (last) {
                    var time = moment(last.createdAt).fromNow();
                    element.tooltip({content: "Last post " + time + " in " + last.roomname });
                  } else {
                    element.tooltip({content: "Not found"});
                  }
                  setTimeout(function() {element.tooltip("close");}, 2000);
                }
              );
            }
          });
        }
      });

    }
  ).fail(function(err){
      throw err;
    });
};
var newRoom = true;
display();
setInterval(display, 4000);

var send = function (text) {
  var user = window.location.search;
  var param = 'username';
  user = user.slice(user.indexOf(param) + param.length + 1)
  var ampPos = user.indexOf("&");
  if (ampPos > 0) {
    user = user.slice(0, ampPos);
  }
  var message = {
    'username': user,
    'text': text,
    'roomname': room
  };
  $.post(serverUrl + "classes/messages/",
    JSON.stringify(message),
    function (data) {
      console.log('chatterbox: Message sent');
      display();
    }
  );
};

var getRooms = function() {
  $.get(serverUrl,
    {limit: 100, order: "-createdAt"},
    function (data) {
      var rooms = {};
      rooms[room] = true;
      var $roomSelector = $('.room');
      $roomSelector.html($('<option value="' + room + '">' + room + '</option>'));
      for(var i = 0; i < data.results.length; i++){
        var aRoom = sanitize(data.results[i].roomname);
        if(!rooms[aRoom]){
          $roomSelector.append($('<option value="' + aRoom + '">' + aRoom + '</option>'));
          rooms[aRoom] = true;
        }
      }
    }
  );
};
// getRooms();
// setInterval(getRooms, 15000);

$(document).ready(function() {
  $('.textSend').on('click', function() {
    send($('.inputText').val());
    $('.inputText').val('');
  });

  $('.inputText').keypress(function(e) {
    if (e.keyCode === 13) {
      send($('.inputText').val());
      setTimeout(function() {$('.inputText').val(null);}, 0);
    }
  });

  $('.room').on('change', function() {
    room = $('.room').val();
    newRoom = true;
    display();
  });

  $('.custom button').on('click', function() {
    room = $('.custom input').val();
    $('.custom input').val('');
    newRoom = true;
    display();
  });
});
