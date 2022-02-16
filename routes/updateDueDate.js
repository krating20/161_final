const readBody = require("./utils/read-body");
const sendResponse = require("./utils/send-response");

const updateDueDate = (req, res) => {
  console.log("updateDueDate called...")
  //read the body of the request before doing anything else
  return readBody(req).then((body) => {
    //parse the JSON to get the options object
    const options = JSON.parse(body);
    if (!options.assignment || !options.classes || !options.due_date) {
      return sendResponse(res, 400, {
        error: "assignment, classes, and due date required",
      });
    }
    console.log("updating due date for",options)
    //call the completeAssignment function from the AssignmentsCollection and then send a response
    return req.app.db.updateDueDate(options.assignment,options.classes,options.due_date).then((assignment) => {
      //console.log(assignment)
      sendResponse(res, 200, { assignment });
      return { assignment };
    });
  });
};

module.exports = updateDueDate;
