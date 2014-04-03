hyperagent
==========

hyper+json client for node.js and the browser.

Installation
------------

### Node

```sh
$ npm install hyperagent
```

### Component

```sh
$ component install hypergroup/hyperagent
```

Usage
-----

Call the hyperagent function, passing the root url of the hyper+json API.

```js
var hyperagent = require('hyperagent');

var client = hyperagent('http://api.example.com');
```

Use the client to traverse any paths

```js
client('.users.0.name', function(err, name) {
  console.log('Hello, ' + name);
});

client('.users.0.friends.0.friends.0.name', function(err, name) {
  console.log('Hello friend of a friend, ' + name);
});
```

```js
client.submit('.users.0.update', {name: 'Mike'}, function(err, body, res) {
  console.log(res);
});
```
