// EXERCISE---------------------------------------------------------------11.1

// There’s a security camera near Carla’s lab that’s activated by a motion sensor. It is connected to the network and starts sending out a video stream when it is active. Because she’d rather not be discovered, Carla has set up a system that notices this kind of wireless network traﬀic and turns on a light in her lair whenever there is activity outside, so she knows when to keep quiet.

// She’s also been logging the times at which the camera is tripped for a while and wants to use this information to visualize which times, in an average week, tend to be quiet and which tend to be busy. The log is stored in files holding one time stamp number (as returned by Date.now()) per line.

// 1695709940692
// 1695701068331
// 1695701189163

// The "camera_logs.txt" file holds a list of logfiles. Write an asynchronous function activityTable(day) that for a given day of the week returns an array of 24 numbers, one for each hour of the day, that hold the number of camera network traﬀic observations seen in that hour of the day. Days are identified by number using the system used by Date.getDay, where Sunday is 0 and Saturday is 6.

// The activityGraph function, provided by the sandbox, summarizes such a table into a string.

// To read the files, use the textFile function defined earlier—given a filename, it returns a promise that resolves to the file’s content. Remember that new Date(timestamp) creates a Date object for that time, which has getDay and getHours methods returning the day of the week and the hour of the day.

// Both types of files—the list of logfiles and the logfiles themselves—have each piece of data on its own line, separated by newline ("\n") characters.

async function activityTable(day) {
  let table = [];
  for (let i = 0; i < 24; i++) table[i] = 0;

  let logFileList = await textFile("camera_logs.txt");
  // This assumes there is a function textFile that reads and returns the contents of a file as a string.
  for (let filename of logFileList.split(
    "\n"
  )) /*The code then loops over each filename in logFileList, splitting the list by newline characters to process each log file individually.*/ {
    let log = await textFile(filename);
    for (let timestamp of log.split("\n")) {
      let date = new Date(Number(timestamp));
      // The function then loops over each timestamp in the log file (split by newline characters) and converts each timestamp to a JavaScript Date object.
      if (date.getDay() == day) {
        /*It checks if the day of the week for that timestamp (date.getDay()) matches the input day parameter.*/ table[
          date.getHours()
        ]++;
        /*If the day matches, it increments the corresponding hour in the table array using date.getHours(), which returns the hour of the day (0-23).*/
      }
    }
  }

  return table;
}

activityTable(1).then((table) => console.log(activityGraph(table)));
// The code calls activityTable(1) to generate the activity table for Monday (1 represents Monday since getDay() returns 0-6 for Sunday-Saturday).
// This assumes there is a function activityGraph that takes the table and generates some form of graphical representation.
