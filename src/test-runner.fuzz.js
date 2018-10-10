describe('validate "describe"', () => {
  assert({
    given: 'anything but a string for a label',
    should: `throw an error that it's missing a proper label`,
    arguments: [
      fuzzy.oneOf([
        fuzzy.null(),
        fuzzy.undefined(),
        fuzzy.number(),
        fuzzy.boolean(),
        fuzzy.symbol(),
        fuzzy.date(),
        fuzzy.arrayOf(fuzzy.null()),
        fuzzy.objectOfShape(),
      ]),
    ],
    actual: describe,
    expected: (a) => {
      return {
        name: 'Error',
        message: `Expected 'label' to be of type 'string' but received ${typeof a}`,
      };
    },
    assertion: 'throws',
  });

  assert({
    given: 'anything but a function for the callback',
    should: `throw an error that it's missing a proper callback`,
    arguments: [
      fuzzy.string(),
      fuzzy.oneOf([
        fuzzy.string(),
        fuzzy.null(),
        fuzzy.undefined(),
        fuzzy.number(),
        fuzzy.boolean(),
        fuzzy.symbol(),
        fuzzy.date(),
        fuzzy.arrayOf(fuzzy.null()),
        fuzzy.objectOfShape(),
      ]),
    ],
    actual: describe,
    expected: (a, b) => {
      return {
        name: 'Error',
        message: `Expected 'callback' to be of type 'function' but received ${typeof b}`,
      };
    },
    assertion: 'throws',
  });

  const emptyFunction = () => {};

  assert({
    attempts: 1,
    given: 'a description and function',
    should: 'run the function',
    arguments: [
      fuzzy.string({ prefix: 'text from testing "describe"', maxLength: 0 }),
      () => emptyFunction,
    ],
    actual: describe,
    expected: (a, b) => {
      console.log('carl', a, b);
      if (typeof a !== 'string') {
        return false;
      }
    },
    assertion: 'equal',
  });
});

describe('validate "todo"', () => {
  todo({
    given: 'a todo with no arguments',
    should: 'throw an error',
  });

  todo({
    given: 'a todo with no "give"',
    should: 'throw an error',
  });

  todo({
    given: 'a todo with no "should"',
    should: 'throw an error',
  });

  todo({
    given: 'a todo with valid arguments',
    should: 'run the function',
  });
});

describe('validate "assert"', () => {
  todo({
    given: 'an assert with no arguments',
    should: 'throw an error',
  });

  todo({
    given: 'an assert with invalid arguments',
    should: 'throw an error',
  });

  todo({
    given: 'an assert with valid arguments',
    should: `assert that the "expect" is or isn't valid`,
  });
});

describe('validate "fuzzy.xyz"', () => {
  todo({
    given: 'fuzzy.null()',
    should: 'return a function that returns "null"',
  });

  todo({
    given: 'fuzzy.undefined()',
    should: 'return a function that returns "undefined"',
  });

  todo({
    given: 'fuzzy.number()',
    should: 'return a function that returns a random "number"',
  });

  todo({
    given: 'fuzzy.string()',
    should: 'return a function that returns a random "string"',
  });

  todo({
    given: 'fuzzy.boolean()',
    should: 'return a function that returns a random "boolean"',
  });

  todo({
    given: 'fuzzy.symbol()',
    should: 'return a function that returns a random "symbol"',
  });

  todo({
    given: 'fuzzy.date()',
    should: 'return a function that returns a random "date"',
  });

  todo({
    given: 'fuzzy.arrayOf()',
    should: 'return a function that returns a random "arrayOf"',
  });

  todo({
    given: 'fuzzy.objectOfShape()',
    should: 'return a function that returns a random "objectOfShape"',
  });

  todo({
    given: 'fuzzy.oneOf()',
    should: 'return a function that returns a random "oneOf"',
  });
});
