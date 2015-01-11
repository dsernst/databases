var db = require('../db');

module.exports = {
  messages: {
    get: function (req, res) {
      // query db for messages
      db.query('select * from messages;', function(err, result){
        if (err) throw err;
        //console.log('result = ',result);
        res.send({results: result});
      });
    }, // a function which produces all the messages
    post: function (req, res) {
      username = req.body.username;
      text = req.body.text;
      room = req.body.room;


      // post to messages table
      db.query('insert into messages (username, text, room) values (\'' + username + '\', \'' + text + '\', \'' + room + '\');', function(err, result){
        if (err) throw err;
        res.send('posted');
        console.log('post result = ',result)
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

