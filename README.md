# node-redis-async
Plugin for the [redis](https://github.com/NodeRedis/node_redis) package. Adds a `.cmd()` method that returns a promise. Pass an array to perform any redis command. The real benefit, is that you can nest multiple commands into an array to perform the commands atomicly.

## Getting Started
#### Installation
```shell
npm install --save node-redis-async

# redis is required as a peer dependency
npm install --save redis
```

#### Usage
Typical use of redis involves calling `client.set(key, val, callback)` or `client.setAsync(key, val)` when using something like bluebird.  
This package expose `.cmd()` which takes an array and returns a promise. The first argument is the command.

```javascript
const redis = require('redis');
require('node-redis-async');

const client = redis.createClient(6379, 'redis');

client.cmd(['set', 'mykey', 'myval'])
	.then(res => console.log(res))
	.catch(err => console.error(err));

client.cmd(['get', 'mykey'])
	.then(res => console.log(res))
	.catch(err => console.error(err));
```

#### Multi
Simply pass and array with multiple commands and they will be performed atomically.
```javascript
client.cmd([
	['get', 'mykey'],
	['set', 'key1', 1],
	['set', 'key2', 2],
])
	.then(res => console.log(res))
	.catch(err => console.error(err));
```