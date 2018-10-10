function add(a, b) {
  return a + b;
}

function diff(a, b) {
  return a - b;
}

describe(`'add' sums 2 numbers`, () => {
  assert({
    given: '2 numbers',
    should: 'return the sum of the numbers',
    arguments: [fuzzy.number(), fuzzy.number()],
    actual: add,
    expected: (a, b) => a + b,
    assertion: 'equal',
  });

  assert({
    given: '2 numbers',
    should: 'not return the difference of the numbers',
    arguments: [fuzzy.number(), fuzzy.number()],
    actual: add,
    expected: (a, b) => a - b,
    assertion: 'notEqual',
  });
});

describe(`'diff' sums 2 numbers`, () => {
  assert({
    given: '2 numbers',
    should: 'return the difference of the numbers',
    arguments: [fuzzy.number(), fuzzy.number()],
    actual: diff,
    expected: (a, b) => a + b,
    assertion: 'notEqual',
  });

  assert({
    given: '2 numbers',
    should: 'not return the sum of the numbers',
    arguments: [fuzzy.number(), fuzzy.number()],
    actual: diff,
    expected: (a, b) => a - b,
    assertion: 'equal',
  });
});

describe(`'mult' multiplies 2 numbers`, () => {
  todo({
    given: '2 numbers',
    should: 'return the 2 numbers multiplied together',
  });
});
