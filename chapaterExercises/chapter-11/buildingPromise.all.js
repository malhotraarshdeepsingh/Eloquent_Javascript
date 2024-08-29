// EXERCISE---------------------------------------------------------------8.3

// As we saw, given an array of promises, Promise.all returns a promise that waits for all of the promises in the array to finish. It then succeeds, yielding an array of result values. If a promise in the array fails, the promise returned by all fails too, passing on the failure reason from the failing promise.

// Implement something like this yourself as a regular function called Promise_all.

// Remember that after a promise has succeeded or failed, it can’t succeed or fail again, and further calls to the functions that resolve it are ignored. This can simplify the way you handle a failure of your promise.

function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    let results = [];
    let pending = promises.length;
    for (let i = 0; i < promises.length; i++) {
      promises[i]
        .then((result) => {
          results[i] = result;
          pending--;
          if (pending == 0) resolve(results);
        })
        .catch(reject);
    }
    if (promises.length == 0) resolve(results);
  });
}
