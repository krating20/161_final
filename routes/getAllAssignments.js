const sendResponse = require("./utils/send-response");

const getAllAssignments = (req, res) => {
  return req.app.db.getAllAssignments().then((schedule) => {
    sendResponse(res, 200, {schedule});
  });
};

module.exports = getAllAssignments;
