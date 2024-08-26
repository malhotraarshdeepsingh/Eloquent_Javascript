// EXERCISE---------------------------------------------------------------4.1

// Write a range function that takes two arguments, start and end, and returns an array containing all the numbers from start up to and including end.

// Next, write a sum function that takes an array of numbers and returns the sum of these numbers. Run the example program console.log(sum(range(1, 10))) and see whether it does indeed return 55.

function range(start, end) {
  let arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
}

function sum(arr) {
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum;
}

// Answer given on official website is 

function _range(start, end, step = start < end ? 1 : -1) {
    let array = [];
  
    if (step > 0) {
      for (let i = start; i <= end; i += step) array.push(i);
    } else {
      for (let i = start; i >= end; i += step) array.push(i);
    }
    return array;
}
  
function _sum(array) {
    let total = 0;
    for (let value of array) {
      total += value;
    }
    return total;
}

// This code is more reliable as i forgot the case when the user can give false input which will initialize a infinite loop

// As a bonus assignment, modify your range function to take an optional third argument that indicates the “step” value used when building the array. If no step is given, the elements should go up by increments of one, corresponding to the old behavior. The function call range(1, 10, 2) should return [1, 3, 5, 7, 9]. Make sure this also works with negative step values so that range(5, 2, -1) produces [5,4, 3, 2].

function __range(start, end, step) {
  if (step === 0) {
    throw new Error("Step cannot be 0");
  }

  if (step) {
    if(start<end && step>0) {
        let arr = [];
        for (let i = start; i <= end; i += step) {
        arr.push(i);
        }
        return arr;
    }
    if(start>end && step<0) {
        let arr = [];
        for (let i = start; i >= end; i += step) {
        arr.push(i);
        }
        return arr;
    }
  }

  if (!step) {
    if (start < end) {
      let arr = [];
      for (let i = start; i <= end; i++) {
        arr.push(i);
      }
      return arr;
    } else {
      let arr = [];
      for (let i = start; i >= end; i--) {
        arr.push(i);
      }
      return arr;
    }
  }

  else {
    throw new Error("Please input correct values");
  }
}

// That code is good but really huge and also dont handle errors properly, trying to remove code duplications

function ___range(start,end,step) {
  // Determine the direction based on the relationship between start and end
  const isAscending = start < end;

  // If step is not provided, set the default step value
  if (step === undefined) {
    step = isAscending ? 1 : -1;
  }

  // Ensure step is appropriate
  if (step === 0) {
    throw new Error("Step cannot be 0");
  }

  if (isAscending && step < 0) {
    throw new Error("Step must be positive for an ascending range");
  }

  if (!isAscending && step > 0) {
    throw new Error("Step must be negative for a descending range");
  }

  let arr = [];
  for (let i = start; isAscending ? i <= end : i >= end; i += step) {
    arr.push(i);
  }

  return arr;
}