const http = require("http");
const sendResponse = require("./routes/utils/send-response");


const createAssignment = require("./routes/createAssignment.js");
const completeAssignment = require("./routes/completeAssignment.js");
const deleteAssignment = require("./routes/deleteAssignment.js")
const getAssignmentbyclass = require("./routes/getAssignmentbyclass.js");
const getAssignment = require("./routes/getassignment.js");
const getAllAssignments = require("./routes/getAllAssignments.js");
const servePublic = require("./routes/public.js")
const updateDueDate = require("./routes/updateDueDate.js")

const getCompletedAssignments = require("./routes/getCompletedAssignments");
const getinCompletedAssignments = require("./routes/getinCompletedAssignments");

const handleRequests = (db) => {

  const routingTable = {
    "/assignments/complete": {
      GET: getCompletedAssignments,//returns all completed assignments 
    },
    "/assignments/incomplete": {
        GET: getinCompletedAssignments,//returns all incomplete assignments
      },
    "/schedule": {
      GET: getAllAssignments,   //returns all assignments with sorted dates
    },
    //example POST request
    //curl -d '{"classes":"COEN_161", "description":"test","due_date":"04/30/2065"}' -X POST http://localhost:8080/assignment
    "/assignment": {
      POST: createAssignment,
      //PUT example
      //curl -d "assignment=shit&classes=COEN_161" -X POST http://localhost:3000/data
      PUT: completeAssignment,//sets completed to true
      //example GET request with parameters
      //curl localhost:8080/assignment?assignment=shit&classes=COEN_161
      GET: getAssignment,
    },
    "/delete":{
      DELETE: deleteAssignment,
    },
    "/class": {
        GET: getAssignmentbyclass,
      },
    "/updateDueDate":{
      PUT: updateDueDate,
    },
    "/public(.*)":{//serve the whole folder
      GET: servePublic,
    }
  };

  //console.log(routingTable)
  return (req, res) => {
    req.app = { db };
    console.log("request url received:",req.url)
    //console.log("URL:",req.url)
    //console.log("METHOD:",req.method)
    //console.log("BODY:",req.body)
    if(req.url.startsWith("/public")){
      console.log("routed to /public")
      return routingTable["/public(.*)"].GET(req,res)
    }
    if(req.url.startsWith("/class")){
      console.log("routed to /class")
      return routingTable["/class"].GET(req,res)
    }
    let handlersForURL = null;
    for (const [route, handlers] of Object.entries(routingTable)) {
      if (req.url.match(route)) {
        //console.log(req.url, 'matched', route)
        handlersForURL = handlers;
        break;
      }
    }

    if (!handlersForURL) {
      return sendResponse(res, 404, {
        error: `Could not find a handler for url ${req.url}`,
      });
    }

    const handlerForRequestMethod = handlersForURL[req.method];
    if (!handlerForRequestMethod) {
      return sendResponse(res, 405, {
        error: `${req.method} requests are not allowed for ${req.url}`,
      });
    }

    return handlerForRequestMethod(req, res);
  };
};

module.exports = handleRequests;
