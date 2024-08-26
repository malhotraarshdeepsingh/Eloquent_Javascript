// EXERCISE---------------------------------------------------------------5.2

// Write a higher-order function loop that provides something like a for loop statement. It should take a value, a test function, an update function, and a body function. Each iteration, it should first run the test function on the current loop value and stop if that returns false. It should then call the body function, giving it the current value, and finally call the update function to create a new value and start over from the beginning.

// When defining the function, you can use a regular loop to do the actual looping.

function loop(start, test, update, body) {
    for (let value = start; test(value); value = update(value)) {
      body(value);
    }
}

// Example 1: Loop through numbers 0 to 4 and print them
loop(0, n => n < 5, n => n + 1, console.log);
// Output: 0, 1, 2, 3, 4

// Example 2: Countdown from 10 to 1 and print each number
loop(10, n => n > 0, n => n - 1, console.log);
// Output: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1

// Example 3: Iterate through an array
const array = [1, 2, 3, 4, 5];
loop(0, i => i < array.length, i => i + 1, i => console.log(array[i]));
// Output: 1, 2, 3, 4, 5