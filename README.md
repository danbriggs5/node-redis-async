# node-redis-async
Plugin for the [redis](https://github.com/NodeRedis/node_redis) package. Adds a useful `.cmd()` method to the redis client.

### Installation
```shell
npm install --save node-redis-async

# redis is required as a peer dependency
npm install --save redis
```

### Usage
#### Basic
All commands are replaced by the promise-based `.cmd()` method.
```javascript
const redis = require('redis');
require('node-redis-async'); // Load the plugin

const client = redis.createClient(6379, 'redis');

// node-redis-async usage
client.cmd(['set', 'key', 'val'])
	.then(res => console.log(res))
	.catch(err => console.error(err));

// You can still use redis normally
client.set('key', 'val', (err, res) => {
	if (err) {
		console.error(err);
	} else {
		console.log(res);
	}
});
```

#### Multi
Simply pass an array with multiple commands and they will be performed atomically. This removes boilerplate code by performing the necessary `multi()` and `exec()` calls under the hood.
```javascript
client.cmd([
	['get', 'key'],
	['set', 'key1', '1'],
	['set', 'key2', '2'],
])
	.then(res => console.log(res)) // => [ 'val', 'OK', 'OK' ]
	.catch(err => console.error(err));
```

### Casting
Redis stores all values as strings. By default, the `.cmd()` function casts values back to their original types.
```javascript
client.cmd(['set', 'key', 2]);
client.cmd(['get', 'key'])
	.then(res => console.log(res, typeof res)); // => 2 Number

client.cmd(['set', 'key', true]);
client.cmd(['get', 'key'])
	.then(res => console.log(res, typeof res)); // => true Boolean

client.cmd(['set', 'key', '1a']);
client.cmd(['get', 'key'])
	.then(res => console.log(res, typeof res)); // => 1a String
```

#### Disable Casting
To disable casting, use the `noCast` flag.
```javascript
client.cmd(['set', 'key', true]);
client.cmd(['get', 'key'], { noCast: true })
	.then(res => console.log(res, typeof res)); // => true String
```

#### Caveats
Note that a best guess is made when casting. Example:
```javascript
// Set a string that is a valid number => returns a number
client.cmd(['set', 'key', '22']);
client.cmd(['get', 'key'])
	.then(res => console.log(res, typeof res)); // => 22 Number
	
// Set a string that is a valid bool => returns a bool
client.cmd(['set', 'key', 'true']);
client.cmd(['get', 'key'])
	.then(res => console.log(res, typeof res)); // => true Boolean
```
