const { test } = require('tape');
const cast = require('../lib/cast');


test('Cast', (t1) => {
	t1.test('regular string', (t) => {
		t.equal(cast('asdf'), 'asdf', 'is not altered');
		t.end();
	});

	t1.test('string bool', (t) => {
		t.equal(cast('true'), true, 'is cast to a bool');
		t.end();
	});

	t1.test('string integer', (t) => {
		t.equal(cast('3'), 3, 'is cast to an int');
		t.end();
	});

	t1.test('string float', (t) => {
		t.equal(cast('3.14159'), 3.14159, 'is cast to an float');
		t.end();
	});

	t1.test('array', (t) => {
		const arr = ['3', 'asdf'];
		t.deepEqual(cast(arr), [3, 'asdf'], 'items are mapped and cast');
		t.end();
	});

	t1.test('nested array', (t) => {
		const arr = ['abc', ['3', 'asdf']];
		t.deepEqual(cast(arr), ['abc', [3, 'asdf']], 'items are mapped and cast');
		t.end();
	});

	t1.test('object', (t) => {
		const obj = { one: '1', random: 'r' };
		t.deepEqual(cast(obj), { one: 1, random: 'r' }, 'items are iterated over and cast');
		t.end();
	});

	t1.test('nested object', (t) => {
		const obj = { one: '1', random: { two: '2' } };
		t.deepEqual(cast(obj), { one: 1, random: { two: 2 } }, 'items are iterated over and cast');
		t.end();
	});
});
