const mongodb = require("mongodb");
const url = require("url");
const sendResponse = require("./utils/send-response");

const getAssignment = (req, res) => {
  const query = url.parse(req.url, true).query;
  if (!query.assignment || !query.classes) {
    return sendResponse(res, 400, {
      error: "assignment is required as a search parameter",
    });
  }

  return req.app.db
    .getAssignment(query.assignment, query.classes)
    .then((assignment) => {
      sendResponse(res, 200, assignment);
    })
    .catch((err) => {
      if (err.code === "INVALID_ASSIGNMENT") {
        return sendResponse(res, 400, {
          error: `Invalid id ${query.assignment}, must be a classes`,//this not working rn
        });
      } else if (err.code === "NOT_FOUND") {
        return sendResponse(res, 404, {
          error: `No task with classes ${query.assignment} was found`,//same here?
        });
      } else {
        return sendResponse(res, 500);
      }
    });
};

module.exports = getAssignment;
