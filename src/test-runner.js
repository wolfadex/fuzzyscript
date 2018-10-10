const path = require('path');
const assert = require('assert');
const workerpool = require('workerpool');

const MAX_ARRAY_LENGTH = 2 ** 25; // Attempted to use (2 ^ 32) - 1 but node crashed
const random = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(random(min, max));

const results = [];

global.describe = function(label, callback) {
  if (typeof label !== 'string') {
    throw new Error(
      `Expected 'label' to be of type 'string' but received ${typeof label}`,
    );
  }

  if (typeof callback !== 'function') {
    throw new Error(
      `Expected 'callback' to be of type 'function' but received ${typeof callback}`,
    );
  }

  results.push({
    type: 'DESCRIBE',
    payload: label,
  });
  callback();
};

global.todo = function({ given, should } = {}) {
  if (typeof given !== 'string') {
    throw new Error(
      `Expected 'given' to be of type 'string' but received ${typeof given}`,
    );
  }

  if (typeof should !== 'string') {
    throw new Error(
      `Expected 'should' to be of type 'string' but received ${typeof should}`,
    );
  }

  results.push({
    type: 'TODO',
    payload: {
      description: `✓ TODO: Given ${given}, should ${should}`,
    },
  });
};

global.assert = function({
  attempts = 100,
  given,
  should,
  arguments: args,
  actual,
  expected,
  assertion,
} = {}) {
  if (typeof attempts !== 'number') {
    throw new Error(
      `Expected 'attempts' to be of type 'number' but received ${typeof attempts}`,
    );
  }

  if (attempts < 1) {
    throw new Error(
      `Expected 'attempts' to be greater than 0 but got ${attempts}`,
    );
  }

  if (typeof given !== 'string') {
    throw new Error(
      `Expected 'given' to be of type 'string' but received ${typeof given}`,
    );
  }

  if (typeof should !== 'string') {
    throw new Error(
      `Expected 'should' to be of type 'string' but received ${typeof should}`,
    );
  }

  if (typeof actual !== 'function') {
    throw new Error(
      `Expected 'actual' to be of type 'function' but received ${typeof actual}`,
    );
  }

  if (typeof expected !== 'function') {
    throw new Error(
      `Expected 'expected' to be of type 'function' but received ${typeof expected}`,
    );
  }

  if (!Array.isArray(args)) {
    throw new Error(
      `Expected 'arguments' to be of type 'Array' but received ${typeof args}`,
    );
  }

  if (typeof assertion !== 'string') {
    throw new Error(
      `Expected 'assertion' to be of type 'string' but received ${typeof assertion}`,
    );
  }

  if (assert[assertion] == null) {
    throw new Error(
      `Expected 'assertion' to be of one of Node's assertions, see https://nodejs.org/api/assert.html#assert_assert_value_message`,
    );
  }

  let currentArgs = [];

  try {
    for (let i = 0; i < attempts; i++) {
      currentArgs = args.map((arg) => arg());
      assert[assertion](
        assertion === 'throws'
          ? function() {
              actual(...currentArgs);
            }
          : actual(...currentArgs),
        expected(...currentArgs),
      );
    }

    results.push({
      type: 'TEST',
      payload: {
        success: true,
        description: `✓ Given ${given}, should ${should}`,
      },
    });
  } catch (error) {
    results.push({
      type: 'TEST',
      payload: {
        success: false,
        description: `x Given ${given}, should ${should}
With arguments: ${currentArgs
          .map((arg) => (arg && arg.toString ? arg.toString() : arg))
          .join(', ')}
Expexted: ${assertion === 'throws' ? 'It to throw' : expected(...currentArgs)}
Received: ${assertion === 'throws' ? 'Not an error' : actual(...currentArgs)}
With error: ${error}`,
      },
    });
  }
};

global.fuzzy = {
  exact: function(item) {
    return () => item;
  },

  number: function(
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
  ) {
    if (typeof min !== 'number') {
      throw new Error(
        `Expected 'min' to be of type 'number' but received ${typeof min}`,
      );
    }

    if (typeof max !== 'number') {
      throw new Error(
        `Expected 'max' to be of type 'number' but received ${typeof max}`,
      );
    }

    if (isNaN(min)) {
      throw new Error(`Expected 'min' to be a decimal number but found NaN`);
    }

    if (isNaN(max)) {
      throw new Error(`Expected 'max' to be a decimal number but found NaN`);
    }

    return () => random(min, max);
  },

  string: function({
    minLength = 0,
    maxLength = 100000,
    prefix = '',
    suffix = '',
  } = {}) {
    if (typeof minLength !== 'number') {
      throw new Error(
        `Expected 'minLength' to be of type 'number' but received ${typeof minLength}`,
      );
    }

    if (typeof maxLength !== 'number') {
      throw new Error(
        `Expected 'maxLength' to be of type 'number' but received ${typeof maxLength}`,
      );
    }

    if (isNaN(minLength)) {
      throw new Error(
        `Expected 'minLength' to be a decimal number but found NaN`,
      );
    }

    if (isNaN(maxLength)) {
      throw new Error(
        `Expected 'maxLength' to be a decimal number but found NaN`,
      );
    }

    if (minLength < 0) {
      throw new Error(
        `Expected 'minLength' to be at least 0 but found ${minLength}`,
      );
    }

    if (maxLength > MAX_ARRAY_LENGTH) {
      throw new Error(
        `Expected 'maxLength' to be no more than ${MAX_ARRAY_LENGTH} but got ${maxLength}`,
      );
    }

    if (typeof prefix !== 'string') {
      throw new Error(
        `Expected 'prefix' to be of type 'string' but received ${typeof prefix}`,
      );
    }

    if (typeof suffix !== 'string') {
      throw new Error(
        `Expected 'suffix' to be of type 'string' but received ${typeof suffix}`,
      );
    }

    const emptyString = new Array(maxLength);

    emptyString.fill(null);

    const randomChars = emptyString
      .map(() => String.fromCharCode(randomInt(32, 255)))
      .join('');

    return () => `${prefix}${randomChars}${suffix}`;
  },

  null: function() {
    return () => null;
  },

  undefined: function() {
    return () => undefined;
  },

  boolean: function() {
    return () => Math.random() < 0.5;
  },

  symbol: function(symbolOf) {
    return () => {
      if (symbolOf === undefined) {
        return Symbol();
      }

      if (typeof symbolOf === 'function') {
        return Symbol(symbolOf());
      }

      return Symbol(symbolOf);
    };
  },

  date: function({ before, after, asString = false, format } = {}) {
    return () => {
      // TODO
      return new Date();
    };
  },

  oneOf: function(options) {
    if (!Array.isArray(options)) {
      throw new Error(
        `Expected 'options' to be of type 'Array' but received ${typeof options}`,
      );
    }

    return () => {
      const randomItemIndex = randomInt(0, options.length);

      return options[randomItemIndex]();
    };
  },

  arrayOf: function(valuesOf, minLength = 0, maxLength = 100000) {
    if (typeof valuesOf !== 'function') {
      throw new Error(
        `Expected 'valuesOf' to be of type 'function' but received ${typeof valuesOf}`,
      );
    }

    if (typeof minLength !== 'number') {
      throw new Error(
        `Expected 'minLength' to be of type 'number' but received ${typeof minLength}`,
      );
    }

    if (minLength < 0) {
      throw new Error(
        `Expected 'minLength' to be at least 0 but received ${minLength}`,
      );
    }

    if (typeof maxLength !== 'number') {
      throw new Error(
        `Expected 'maxLength' to be of type 'number' but received ${typeof maxLength}`,
      );
    }

    if (maxLength > MAX_ARRAY_LENGTH) {
      throw new Error(
        `Expected 'maxLength' to be no greater than ${MAX_ARRAY_LENGTH} but received ${maxLength}`,
      );
    }

    return () => {
      const arrayLength = randomInt(minLength, maxLength);
      const array = new Array(arrayLength);

      array.fill(null);

      const finalArray = array.map(valuesOf);

      return finalArray;
    };
  },

  objectOfShape: function({
    minKeys = 0,
    maxKeys = Number.MAX_SAFE_INTEGER,
    requiredKeys = {},
  } = {}) {
    return () => {
      // TODO
      return {};
    };
  },
};

function runTests(file) {
  require(path.join('../', file));

  return results;
}

// create a worker and register public functions
workerpool.worker({
  runTests: runTests,
});
