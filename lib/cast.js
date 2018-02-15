function cast(val) {
	if (Array.isArray(val)) {
		return val.map(cast);
	}

	if (val instanceof Object) {
		const copy = {};

		Object.keys(val).forEach((key) => {
			copy[key] = cast(val[key]);
		});

		return copy;
	}

	// If for some reason a value is already a number or bool then just return it
	if (typeof val === 'number' || typeof val === 'boolean') {
		return val;
	}

	if (typeof val !== 'string') {
		return null;
	}

	// Cast booleans
	if (val === 'true') {
		return true;
	}
	if (val === 'false') {
		return false;
	}

	// Cast numbers
	if (!Number.isNaN(val)) {
		const float = parseFloat(val);

		if (val === String(float)) {
			return float;
		}
	}

	// Return string
	return val;
}

module.exports = cast;
