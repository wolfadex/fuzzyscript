# FuzzyScript

A library for testing JavaScript in concurrent workers with [fuzzy values](https://en.wikipedia.org/wiki/Fuzzing).

#### Example:

Given these 2 files:

```javascript
// basic-math.js
export const add = (a, b) => a + b;
```

```javascript
// basic-math.fuzz.js
import { add } from './basic-math';

describe('validate "add"', () => {
  assert({
    given: '2 numbers',
    should: 'return the sum of the numbers',
    arguments: [fuzzy.number(), fuzzy.number()],
    actual: add,
    expected: (a, b) => a + b,
    assertion: 'equal',
  });
});
```

On the command line run:

```
> cd ./project_root
> fuzzy

Gathering tests

validate "add"
✓ Given 2 numbers, should return the sum of the numbers

Successes: 1 of 1
Todos: 1 of 1
Failures: 1 of 1

Pass

>
```

## Install:

Still a WIP, want to get it a little more stable before adding to npm

## API

#### **_describe(label: string, callback: Function)_**

`label`: A string used to describe what you'll be asserting. You can nest `describe`s if you need more labels.

`callback`: The function that contains your assertions and possibly more `describe`s.

<br>

#### **_assert({ given: string, should: string, actual: Function, expected: Function, arguments: Array, attempts: number, assertion: string })_**

`given`: Describes the arguments given to your function.

`should`: Describes the expected return value from running your function.

`actual`: The function you are testing.

`expected`: What your function is being compared against.

`arguments`: An array of arguments that gets passed to your `actual` and `expected`. See [fuzzy](#fuzzy) for details on arguments.

`attempts`: How many times to run the assert, defaults to 100.

`assertion`: The [Node assertion](https://nodejs.org/api/assert.html) to use.

<br>

#### **_todo({ given: string, should: string })_**

`given`: Describes the arguments given to your function.

`should`: Describes the expected return value from running your function.

_Note: During development `todo`s will pass with a warning. This is to allow you to mock out which test your want to run. However during a production build `todo`s count as failures._

<br>

### **_fuzzy_**

This is used to generate the random arguments. For example `fuzzy.number()` generates a random number. Some fuzzy values have optional arguments to narrow down the range of values generated. For example `fuzzy.number(-10, 10)` limits the number generated to be between -10 and 10 inclusive.

Fuzzy values:

#### **_number(min: number, max: number)_**

Generates a number between `min` and `max` inclusive.

`min`: The lower inclusive bound. Defaults to `Number.MIN_SAFE_INTEGER`.

`max`: The upper inclusive bound. Defaults to `Number.MAX_SAFE_INTEGER`.

#### **_undefined()_**

Returns `undefined`.

#### **_null()_**

Returns `null`.

#### **_boolean()_**

Returns `true` or `false`.

#### **_string({ minLength: number, maxLength: number, prefix: string, suffix: string })_**

Generates a string of random characters between `minLength` and `maxLength` inclusive. Then adds the `prefix` and `suffix`.

`minLength`: The lower inclusive bound. Defaults to 0.

`maxLength`: The upper inclusive bound. Defaults to `Number.MAX_SAFE_INTEGER`.

`prefix`: A string of characters attached to the front of the random string. Defaults to an empty string.

`suffix`: A string of characters attached to the end of the random string. Defaults to an empty string.

#### **_arrayOf(valueOf: Function, minLength: number, maxLength: number)_**

Returns an array of values which are computed by `valueOf`.

`valueOf`: A function that returns a value. This can be another [fuzzy](#fuzzy) value of a hard coded one.

`minLength`: The smallest possible size of the array. Defaults to 0.

`maxLength`: The largest possible size of the array. Defaults to `100000`. 2 ^ 32 is the largest a JavaScript array can be, however arrays of near this size can crash node.

#### **_oneOf(options: Array)_**

Returns 1 of the values in `options`. Each value in `options` should be either a [fuzzy](#fuzzy) value or a custom one.

```javascript
// TODO:  Add an example
```

#### **_objectOfShape({ minKeys: number, maxKeys: number, requiredKeys: Object })_**

Returns an object of the specified shape. Can have randomly generated key/values, user specified ones, or a mixture.

```javascript
// TODO:  Add an example
```

#### **_symbool()_**

TODO

```javascript
// TODO:  Add an example
```

#### **_date()_**

TODO

```javascript
// TODO:  Add an example
```
