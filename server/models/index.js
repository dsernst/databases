var db = require('../db');

module.exports = {
  messages: {
    get: function (req, res) {
      db.query('select * from messages;', function(err, result){
        if (err) throw err;
        //console.log('result = ',result);
        res.send({results: result});
      });
    }, // a function which produces all the messages
    post: function (req, res) {
      console.log(req);
      username = 'testUser';
      text = 'testText';
      room = 'lobby';
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

