const readBody = require("./utils/read-body");
const sendResponse = require("./utils/send-response");

const completeAssignment = (req, res) => {
  //read the body of the request before doing anything else
  return readBody(req).then((body) => {
    //parse the JSON to get the options object
    const options = JSON.parse(body);
    if (!options.assignment || !options.classes) {
      return sendResponse(res, 400, {
        error: "assignment is a required field",
      });
    }
    //call the completeAssignment function from the AssignmentsCollection and then send a response
    return req.app.db.completeAssignment(options.assignment,options.classes).then((assignment) => {
      sendResponse(res, 200, { assignment });
      return { assignment };
    });
  });
};

module.exports = completeAssignment;
