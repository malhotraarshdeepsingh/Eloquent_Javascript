// EXERCISE---------------------------------------------------------------5.1

// Use the reduce method in combination with the concat method to “flatten” an array of arrays into a single array that has all the elements of the original arrays.

const arrays = [[1, 2, 3], [4, 5], [6]];

console.log(arrays.reduce((accumulator, sub_arr) => accumulator.concat(sub_arr), []));
// → [1, 2, 3, 4, 5, 6]