const readBody = require("./utils/read-body");
const sendResponse = require("./utils/send-response");

const createAssignment = (req, res) => {
  //console.log("create assignment called with:",req)
  return readBody(req).then((body) => {
    const options = JSON.parse(body);
    if (!options.assignment||!options.classes||!options.description||!options.due_date) {
      return sendResponse(res, 400, {
        error: "Missing an argument: requires assignment, class, description, and due date\n",
      });
    }
    //console.log("options:",options)

    return req.app.db.createAssignment(options.assignment,options.classes,options.description,options.due_date).then((task) => {
      sendResponse(res, 201, { task });
    });
  });
};

module.exports = createAssignment;
