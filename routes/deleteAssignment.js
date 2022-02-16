const readBody = require("./utils/read-body");
const sendResponse = require("./utils/send-response");

const deleteAssignment = (req, res) => {
  //read the body of the request before doing anything else
  return readBody(req).then((body) => {
    //parse the JSON to get the options object
    const options = JSON.parse(body);
    if (!options.assignment || !options.classes) {
      return sendResponse(res, 400, {
        error: "assignment and classes are required",
      });
    }
    //call the deleteAssignment function from the AssignmentsCollection and then send a response
    return req.app.db.deleteAssignment(options.assignment,options.classes).then(() => {
      sendResponse(res, 200, {});
      return;
    });
  });
};

module.exports = deleteAssignment;
