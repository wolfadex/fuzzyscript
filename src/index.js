const workerpool = require('workerpool');
const chalk = require('chalk');
const glob = require('glob');

console.log(chalk('Gathering tests'));

const isProduction = process.env.NDOE_ENV === 'production';

glob('**/*.fuzz.js', function(err, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
  if (files == null) {
    console.log(chalk('No tests found'));
    return;
  }

  const pool = workerpool.pool(__dirname + '/test-runner.js');
  let total = 0;
  let successes = 0;
  let failures = 0;
  let todos = 0;

  pool
    .exec('runTests', files)
    .then(function(results) {
      results.map(({ type, payload }) => {
        switch (type) {
          case 'DESCRIBE':
            console.log('\n' + chalk(payload));
            break;
          case 'TODO':
            total++;
            if (isProduction) {
              todos++;
              console.log(chalk(chalk.red(payload.description)));
            } else {
              todos++;
              console.log(chalk(chalk.yellow(payload.description)));
            }
            break;
          case 'TEST':
            total++;
            if (payload.success) {
              successes++;
              console.log(chalk(chalk.green(payload.description)));
            } else {
              failures++;
              console.log(chalk(chalk.red(payload.description)));
            }
            break;
        }
      });
    })
    .catch(function(err) {
      console.error(err);
    })
    .then(function() {
      pool.terminate(); // terminate all workers when done

      console.log('\n');

      if (successes === total) {
        console.log(chalk.green(`Successes: ${successes} of ${total}`));
      } else {
        console.log(chalk.yellow(`Successes: ${successes} of ${total}`));
      }

      if (todos === 0) {
        console.log(chalk.green(`Todos: ${todos} of ${total}`));
      } else {
        if (isProduction) {
          console.log(chalk.red(`Todos: ${todos} of ${total}`));
        } else {
          console.log(chalk.yellow(`Todos: ${todos} of ${total}`));
        }
      }

      if (failures === 0) {
        console.log(chalk.green(`Failures: ${failures} of ${total}`));
      } else {
        console.log(chalk.red(`Failures: ${failures} of ${total}`));
      }

      if (isProduction) {
        if (successes === total) {
          console.log(chalk.green('\nPass'));
        } else {
          console.log(chalk.red('\nFail'));
        }
      } else {
        if (failures === 0) {
          console.log(chalk.green('\nPass'));
        } else {
          console.log(chalk.red('\nFail'));
        }
      }
    });
});
