describe('test-runner tests', () => {
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
