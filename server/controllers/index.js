var models = require('../models');
// var bluebird = require('bluebird');


module.exports = {
  messages: {
    get: function (req, res) {
      var data = models.messages.get(req, res)
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      models.messages.post(req, res)
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {}
  }
};

