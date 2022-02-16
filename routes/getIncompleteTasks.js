const sendResponse = require("./utils/send-response");

const getIncompleteTasks = (req, res) => {
  return sendResponse(res, 400, {
    error:
      "no need implement",
  });
};

module.exports = getIncompleteTasks;
