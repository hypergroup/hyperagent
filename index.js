/**
 * Module dependencies
 */

var hyperpath = require('hyper-path');
var defaults = require('superagent-defaults');

/**
 * Create a hyperagent
 *
 * @param {String} root The root URL of the api
 * @param {String} delim Optional delimeter. defaults to '.'
 * @return {Client}
 */

module.exports = function(root, delim) {
  var agent = createAgent(root);

  function Client(path, fn) {
    var req = hyperpath(path, agent, delim);
    if (!fn) return req;
    return req.on(fn);
  }

  Client.submit = function(path, body, fn) {
    var req = Client(path);
    var _get = req.get;
    req.refresh = req.get = function(cb) {
      cb = cb || this._fn;
      _get.call(req, function(err, form) {
        if (err) return cb(err);
        if (!form || !form.action) return cb();

        for (var k in form.input || {}) {
          if (!body[k] && form.input.hasOwnProperty(k)) body[k] = form.input[k].value;
        }

        var method = (form.method || 'get').toLowerCase();
        var req = agent.request[method](form.action);

        method === 'get'
          ? req.query(body)
          : req.send(body);

        req.end(function(err, res) {
          if (err) return cb(err);
          if (!res.ok) return cb(new HyperError(res));
          cb(null, res.body, res.links);
        });
      });
    };
    if (!fn) return req;
    return req.on(fn);
  };

  Client.use = function(fn) {
    agent.request.on('request', fn);
  };

  Client.set = function(a, b){
    agent.request.set(a, b);
    return Client;
  };

  return Client;
};

/**
 * Create an agent using root
 *
 * @param {String} root
 * @return {Agent}
 * @api private
 */

function createAgent(root) {
  var request = defaults();
  var req = request.request;
  req.parse['application/hyper+json'] = req.parse['application/json'];

  var Agent = {};

  Agent.root = function(fn) {
    return Agent.get(root, fn);
  }

  Agent.get = function(href, fn) {
    request
      .get(href)
      .end(function(err, res) {
        if (err) return fn(err);
        if (!res.ok) return fn(new HyperError(res));
        fn(null, res.body, res);
      });
  };

  Agent.request = request;

  return Agent;
}

/**
 * Create a hyper error given a superagent response
 *
 * @param {Response} res
 */

function HyperError(res) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'HyperError';
  this.status = res.status;
  if (res.body && res.body.error) this.message = res.body.error.message;
  else this.message = res.text;
};
