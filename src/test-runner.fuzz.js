describe('test-runner tests', () => {
  assert({
    given: 'anything but a string for a label',
    should: `throw an error that it's missing a prober label`,
    arguments: [
      fuzzy.oneOf([
        // fuzzy.null(),
        // fuzzy.undefined(),
        // fuzzy.number(),
        fuzzy.arrayOf(fuzzy.null()),
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

  // assert({
  //   attempts: 1,
  //   given: 'just a label',
  //   should: `throw an error that it's missing a prober label`,
  //   arguments: [],
  //   actual: describe,
  //   expected: () => {
  //     return {
  //       name: 'Error',
  //       message: `Expected 'label' to be of type 'string' but received undefined`,
  //     };
  //   },
  //   assertion: 'throws',
  // });

  // assert({
  //   given: 'a description and function',
  //   should: 'run the function',
  //   arguments: [fuzzy.string(), () => emptyFunction],
  //   actual: describe,
  //   expected: (a, b) => {
  //     if (typeof a !== 'string') {
  //       return false;
  //     }
  //   },
  //   assertion: 'equal',
  // });
});
