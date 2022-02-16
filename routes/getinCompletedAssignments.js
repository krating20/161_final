const sendResponse = require("./utils/send-response");

const getinCompletedAssignments = (req, res) => {
  return req.app.db.getinCompletedAssignments().then((tasks) => {
    sendResponse(res, 200, { tasks });
  });
};

module.exports = getinCompletedAssignments;
