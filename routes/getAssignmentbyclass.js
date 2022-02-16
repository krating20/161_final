const mongodb = require("mongodb");
const url = require("url");
const sendResponse = require("./utils/send-response");

const getAssignmentbyclass = (req, res) => {
  console.log("by class...")
  const query = url.parse(req.url, true).query;
  if (!query.classes) {
    return sendResponse(res, 400, {
      error: "classes is required as a search parameter",
    });
  }

  return req.app.db
    .getAssignmentbyclass(query.classes)
    .then((data) => {
      console.log("DATA:",data)
      sendResponse(res, 200, data);
    })
    .catch((err) => {
      if (err.code === "INVALID_class") {
        return sendResponse(res, 400, {
          error: `Invalid id ${query.classes}, must be a classes`,//this not working rn
        });
      } else if (err.code === "NOT_FOUND") {
        return sendResponse(res, 404, {
          error: `No task with classes ${query.classes} was found`,//same here?
        });
      } else {
        return sendResponse(res, 500);
      }
    });
};

module.exports = getAssignmentbyclass;
