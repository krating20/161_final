const sendResponse = require("./utils/send-response");

const getCompletedAssignments = (req, res) => {
  return req.app.db.getCompletedAssignments().then((tasks) => {
    sendResponse(res, 200, { tasks });
  });
};

module.exports = getCompletedAssignments;
