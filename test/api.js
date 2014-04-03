/**
 * Module dependencies
 */

var stack = require('simple-stack-common');
var request = require('superagent');

var app = module.exports = stack();

app.get('/', function(req, res) {
  res.json({
    users: {
      href: req.base + '/users'
    }
  });
});

app.get('/users', function(req, res) {
  res.json({
    collection: [
      {href: req.base + '/users/0'}
    ]
  });
});

app.get('/users/:id', function(req, res) {
  res.json({
    name: 'Mike',
    friends: {
      href: req.base + '/users/1/friends'
    },
    update: {
      action: req.base + '/users/1',
      method: 'POST',
      input: {
        name: {
          type: 'text'
        }
      }
    }
  });
});

app.post('/users/:id', function(req, res) {
  res.send({hello: 'world', body: req.body});
});

app.get('/users/:id/friends', function(req, res) {
  res.json({
    collection: [
      {href: req.base + '/users/4'}
    ]
  });
});
