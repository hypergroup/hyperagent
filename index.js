/**
 * Module dependencies
 */

var superagent = require('superagent');
var Request = superagent.Request;
var Response = superagent.Response;
var defaults = require('superagent-defaults');
var envs = require('envs');

/**
 * Create the client
 */

var client = defaults();

/**
 * Make a call to the api root
 *
 * @return {Request}
 * @api public
 */

module.exports = exports = function() {
  return client.get(exports.API_URL);
};

/**
 * Inherit from the client
 */

for (var method in client) {
  if (typeof client[method] === 'function') exports[method] = client[method].bind(client);
}

/**
 * Expose the API_URL
 */

exports.API_URL = envs('API_URL', '/api');

/**
 * Profile the request
 */

client.on('request', function(req) {
  // If they didn't give us a profile function don't do anything
  if (!exports.profile) return;

  // Start profiling the request
  var done = exports.profile('hyperagent.response_time');

  req.on('response', function(res) {
    var info = {
      url: req.url,
      request_id: res.headers['x-request-id']
    };

    info['count#hyperagent.method.' + req.method] = 1;
    info['count#hyperagent.status.' + res.status] = 1;
    info['count#hyperagent.status-type.' + res.statusType] = 1;

    // Log the request
    done(info);
  });
});

// TODO come up with a retry strategy
// TODO set a reasonable timeout

/**
 * Force request to ignore the local cache
 *
 * @return {Request}
 * @api public
 */

Request.prototype.forceLoad =
Request.prototype.ignoreCache = function() {
  this.set('cache-control', 'no-cache');
  return this;
};

/**
 * Patch the Request to emit errors when it's not 2xx
 *
 * @api public
 */

var end = Request.prototype.end;

Request.prototype.end = function(fn) {
  var self = this;
  end.call(this, function(res) {
    self.emit('response', res);
    if (!res.ok) return self.emit('error', res.body || new Error(res.text));
    fn(res);
  });
};

/**
 * Follow a link
 *
 * @return {Request}
 * @api public
 */

Response.prototype.follow = function(rel) {
  // TODO make sure the rel exists; if not emit an error

  var href = typeof this.body[rel] === 'object'
    ? this.body[rel].href
    : this.body[rel];

  return client.get(href);
};

/**
 * Submit a form
 *
 * @return {Request}
 * @api public
 */

Response.prototype.submit = function(name, values) {
  // TODO make sure the rel exists; if not emit an error

  var form = this.body[rel];

  // TODO implement

  return client.post(form.action);
};
