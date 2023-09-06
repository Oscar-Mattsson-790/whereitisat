const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");

exports.handler = async (event, context) => {
  try {
    const { Items } = await db.scan({ TableName: "events" }).promise();
    return sendResponse(200, { success: true, events: Items });
  } catch (error) {
    return sendError(500, { success: false, message: "Could not get events" });
  }
};
