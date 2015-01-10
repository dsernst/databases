var fs = require("fs");
var _ = require("underscore");

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


var defaultCorsHeaders = {

  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = function(request, response) {

  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  var createBlank = function () {
    var empty = JSON.stringify([]);
    fs.writeFile("storage", empty);
  };


  // Read storage file, and make into array.
  var storage = [];
  fs.readFile("./storage", function(err, data) {
    if (err) {
      if (err.code === "ENOENT") {
        createBlank();
      }
      console.log(err);
    } else {
      storage = JSON.parse(data);
    }
    if (request.method === "POST") {
      saveNewMessage();
    } else if (request.method === "GET") {
      getFilter();
    }
  });

  // The outgoing status.
  var statusCode = 200;


  // If they send us data with their GET request to filter results
  var getFilter = function(){
    var getData = require("url").parse(request.url, true).query;
    console.log(getData);
    if (getData.order) {
      var reverse = false;
      if (getData.order[0] === "-") {
        reverse = true;
        getData.order = getData.order.slice(1);
      }
      storage = _.sortBy(storage, function(result) {
        return result[getData.order];
      });
      if (reverse) {
        storage = storage.reverse();
      }
    }
    if (getData.limit) {
      if (getData.limit > 0 && getData.limit < storage.length) {
        storage = storage.slice(0, getData.limit);
      }
    }
    var wheres = _.reduce(getData, function(memo, value, key) {
      if (key.slice(0,5) === "where") {
        memo[key.slice(6, key.length - 1)] = value;
      }
      return memo;
    }, {});
    if (Object.keys(wheres).length > 0) {
      storage = _.where(storage, wheres);
    }
    sendResponse();
  };

  // If they write a new message
  var saveNewMessage = function() {
    request.on("data", function(chunk) {
      var newMsg = JSON.parse(chunk);
      newMsg.createdAt = JSON.stringify(Date.now());
      storage.push(newMsg);
      fs.writeFile("./storage", JSON.stringify(storage), function(err) {
          if(err) {
            console.log(err);
            if (err.code === "ENOENT") {
              createBlank();
            }
          } else {
              console.log("The file was saved!");
          }
        }
      );
    });
    statusCode = 201;
    sendResponse();
  };

  var routes = {
    "": "basecase",
    "classes": "test writers are liars"
  };

  var path = request.url.split("/");
  if (path[1][0] === "?") {
    path[1] = "";
  }

  if (routes[path[1]] === undefined) {
    statusCode = 404;
  }

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers["Content-Type"] = "application/json";

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);


  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  var sendResponse = function () {
    response.end(JSON.stringify({results: storage}));
  };
};
