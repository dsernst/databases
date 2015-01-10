var controllers = require('./controllers');
var router = require('express').Router(); // creates a new Router - isolated instance of middleware and routes

for (var route in controllers) {
  router.route("/" + route)
    .get(controllers[route].get) // defines route for GET
    .post(controllers[route].post); // defines route for POST
}

module.exports = router;
