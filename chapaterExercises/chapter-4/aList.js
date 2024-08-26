// EXERCISE---------------------------------------------------------------4.3

// As generic blobs of values, objects can be used to build all sorts of data structures. A common data structure is the list (not to be confused with arrays). A list is a nested set of objects, with the first object holding a reference to the second, the second to the third, and so on:

/*    
let list = {
    value: 1,
    rest: {
        value: 2,
        rest: {
            value: 3,
            rest: null
        }    
    }   
};
*/

// A nice thing about lists is that they can share parts of their structure. For example, if I create two new values {value: 0, rest: list} and {value: -1, rest: list} (with list referring to the binding defined earlier), they are both independent lists, but they share the structure that makes up their last three elements. The original list is also still a valid three-element list.

// Write a function arrayToList that builds up a list structure like the one shown when given [1, 2, 3] as argument. Also write a listToArray function that produces an array from a list. Add the helper functions prepend, which takes an element and a list and creates a new list that adds the element to the front of the input list, and nth, which takes a list and a number and returns the element at the given position in the list (with zero referring to the first element) or undefined when there is no such element.

// If you haven’t already, also write a recursive version of nth.

function arrayToList(array) {
    let list = null;
    // Loop through the array backward and build the list by nesting objects
    for (let i = array.length - 1; i >= 0; i--) {
      list = {value: array[i], rest: list};
    }
    return list;
}

function listToArray(list) {
    let array = [];
    // node = list : The loop starts by assigning the first node of the linked list (list) to the variable node.
    // node; : The loop condition checks if node is truthy (i.e., not null). As long as node is not null, the loop continues.
    // node = node.rest : The loop body updates the node variable to point to the next node in the list (node.rest). This moves the loop through each node in the list until it reaches the end (node.rest becomes null).
    for (let node = list; node; node = node.rest) {
      array.push(node.value);
    }
    return array;
}
  
function prepend(value, list) {
    return {value, rest: list};
}
  
function nth(list, n) {
    // Base case: if the list is null, return undefined
    if (!list) return undefined;
    // Base case: if n is 0, return the current value
    else if (n == 0) return list.value;
    // Recursive case: go to the next node and decrease n by 1
    else return nth(list.rest, n - 1);
}
