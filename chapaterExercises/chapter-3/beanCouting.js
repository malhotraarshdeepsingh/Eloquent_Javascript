// Write a function called countBs that takes a string as its only argument and returns a number that indicates how many uppercase B characters there are in the string.

function countBs(string) {
  let count = 0;

  // Use a for loop to iterate over each character in the string.
  for (let i = 0; i < string.length; i++) {
    // Check if the current character is an uppercase B.
    if (string[i] === 'B') {
      count++;
    }
  }

  // Return the count of uppercase B characters.
  return count;
}