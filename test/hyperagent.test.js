/**
 * Module dependencies
 */

var should = require('should');
var hyperagent = require('..');
var api = require('./api');

describe('hyperagent', function() {
  var client, root;
  before(function(done) {
    var server = api.listen(0);
    root = 'http://127.0.0.1:' + server.address().port;
    client = hyperagent(root);
    done();
  });

  it('should traverse the api from the root', function(done) {
    client('.users.0.name', function(err, name) {
      if (err) return done(err);
      should.exist(name);
      name.should.eql('Mike');
      done();
    });
  });

  it('should submit a form', function(done) {
    client.submit('.users.0.update', {name: 'Cameron'}, function(err, body) {
      if (err) return done(err);
      should.exist(body);
      should.exist(body.hello);
      should.exist(body.body);
      done();
    });
  });

  it('should set scope', function(done) {
    var req = client('user.friends.0.name');
    req.scope({user: {href: root + '/users/2'}});
    req.get(function(err, name) {
      if (err) return done(err);
      should.exist(name);
      name.should.eql('Mike');
      done();
    });
  });

  it('should return null on a undefined property', function(done) {
    client('.users.0.remove', function(err, remove) {
      if (err) return done(err);
      should.not.exist(remove);
      done();
    });
  });
});
