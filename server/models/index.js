var db = require('../db');

module.exports = {
  messages: {
    get: function (req, res) {
      db.query('select * from messages', function(err, result){
        if (err) throw err;
        console.log(result);
        // res.end(result)
      });
    }, // a function which produces all the messages
    post: function () {} // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

