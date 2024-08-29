// EXERCISE---------------------------------------------------------------8.2

// Rewrite the function from the previous exercise without async/await, using plain Promise methods.
// In this style, using Promise.all will be more convenient than trying to model a loop over the logfiles. In the async function, just using await in a loop is simpler. If reading a file takes some time, which of these two approaches will take the least time to run?
// If one of the files listed in the file list has a typo, and reading it fails, how does that failure end up in the Promise object that your function returns?