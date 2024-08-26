// EXERCISE---------------------------------------------------------------4.2
// Arrays have a reverse method that changes the array by inverting the order in which its elements appear. 
// For this exercise, write two functions, reverseArray and reverseArrayInPlace. 
// The first, reverseArray, should take an array as its argument and produce a new array that has the same elements in the inverse order. 
// The second, reverseArrayInPlace, should do what the reverse method does: modify the array given as its argument by reversing its elements. Neither may use the standard reverse method.

function reverseArray(arr) {
    let reverseArray = [];
    for (let i=arr.length-1; i=0; i--) {
        reverseArray.push(arr[i]);
    }
    return reverseArray;
}

function reverseArrayInPlace(arr) {
    // Loop through half of the array (ignoring the middle element if odd length)
    for (let i = 0; i < Math.floor(arr.length / 2); i++) {
        // Store the current element at index i
        let old = arr[i];
        // Swap the element at index i with the element at the corresponding position from the end
        arr[i] = arr[arr.length - 1 - i];
        // Set the element at the end to the value originally at index i
        arr[arr.length - 1 - i] = old;
    }
    return arr;
}

let myArray = ["A", "B", "C"];
console.log(reverseArray(myArray));
// → ["C", "B", "A"];
console.log(myArray);
// → ["A", "B", "C"];
let arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]
