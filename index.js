const redis = require('redis');
const cast = require('./lib/cast');


const originalCreateClient = redis.createClient;

// Overwrite the createClient() method so we can add a custom method to the redis client.
redis.createClient = (...args) => {
	const client = originalCreateClient(...args);

	client.cmd = (cmds, opts) => new Promise((resolve, reject) => {
		const options = opts instanceof Object ? opts : {};

		if (cmds === null || cmds === undefined) {
			return resolve(undefined);
		}

		if (!Array.isArray(cmds)) {
			return reject(Error('redis.cmd() first argument must be an array'));
		}

		if (cmds.length === 0) {
			return resolve(undefined);
		}

		// Execute multiple commands
		// Calling multi with an empty array or even null will return an empty array
		if (Array.isArray(cmds[0])) {
			return client.multi(cmds).exec((err, resp) => {
				if (err) {
					return reject(err);
				}
				if (options.noCast) {
					return resolve(resp);
				}
				return resolve(cast(resp));
			});
		}

		// Execute a single command
		return client[cmds[0]](...cmds.slice(1), (err, resp) => {
			if (err) {
				return reject(err);
			}
			if (options.noCast) {
				return resolve(resp);
			}
			return resolve(cast(resp));
		});
	});

	return client;
};

// Export the module for convenience
module.exports = redis;
