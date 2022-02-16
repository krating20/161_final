const path = require("path");
const fs = require("fs").promises;
const http = require("http");
const mongodb = require("mongodb");

const handleRequests = require("./handleRequests");
const AssignmentsCollection = require("./mongodb/AssignmentsCollection");

const REQUIRED_CONFIGURATION = [
  "username",
  "password",
  "address",
  "defaultDatabase",
  "port",
];

/**
 * @function setupServer
 * @description Initializes all the state necessary for the server.
 *
 * @param {Object} config - configuration object that hopefully contains all the server configuration
 * @returns { db: TasksCollection, port: number }
 */
const setupServer = (config) => {

  const authentication = `${config.username}:${config.password}`;
  const address = `${config.address}/${config.defaultDatabase}`;
  const options = "retryWrites=true&w=majority";
  const mongoURL = `mongodb+srv://${authentication}@${address}?${options}`;


  const client = new mongodb.MongoClient(mongoURL, {
 
    useUnifiedTopology: true,
  });


  const connectionPromise = client.connect();
  return connectionPromise.then(() => {
    return {
      port: config.port,
      db: AssignmentsCollection(client.db(config.defaultDatabase)),
    };
  });
};

/**
 * @function catchJSONConfigFileReadingErrors
 * @description Handles any errors that might occur while reading a JSON file
 *  and exits the program with an approppriate message.
 *
 * @param {string} file - the name of the file that was attempted to be read
 * @param {Error} err - the error that was returned
 *
 * @exits
 */
const catchJSONConfigFileReadingErrors = (file, err) => {
  // this checks specifically for any Syntax error. when JSON.parse fails
  // to prse JSON, it returns SyntaxaError
  if (err instanceof SyntaxError) {
    console.log(
      "file contents could not be decoded as JSON, verify the JSON is proper using a JSON linter"
    );
  } else if (err.code === "ENOENT") {
    console.log(`${file} was not found`);
  } else if (err.code === "EISDIR") {
    console.log(`${file} is a directory but a file was expected`);
  } else {
    console.log(err);
  }

  process.exit(1);
};

/**
 * @function createServer
 * @description creates an HTTP server on the given port and passes the initial state
 * to every request listener
 *
 * @param {{ db: TasksCollection, port: number }} initializedServerState
 */
const createServer = (initializedServerState) => {
  const server = http.createServer(handleRequests(initializedServerState.db));
  const port = process.argv[2]
  server.listen(port);
  console.log(
    `PID: ${process.pid}. Running on :${port}`
  );
};

/**
 * @function main
 * @description the starting point for this program
 */
const main = () => {
 
  const mainDirectory = __dirname;


  const configurationFilePath = path.join(mainDirectory, "config.json");
  fs.readFile(configurationFilePath, "utf-8")
    .then((configRawContents) => {
      const config = JSON.parse(configRawContents);

  
      const missingKeys = [];
      for (const key of REQUIRED_CONFIGURATION) {
        if (!config[key]) {
          missingKeys.push(key);
        }
      }

      if (missingKeys.length > 0) {
        console.log(
          `Configuration is invalid. Missing the following keys: ${missingKeys}`
        );
        process.exit(1);
      }

      return setupServer(config);
    })
    .catch((err) => {
      catchJSONConfigFileReadingErrors(configurationFilePath, err);
    })
    .then(createServer);
};

main();
