const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");
const { nanoid } = require("nanoid");

exports.handler = async (event, context) => {
  const eventId = event.pathParameters.eventId;

  try {
    // Check if event exists
    const eventData = await db
      .get({
        TableName: "events",
        Key: { id: eventId },
      })
      .promise();

    if (!eventData.Item) {
      return sendError(404, { success: false, message: "Event not found" });
    }

    const ticketId = nanoid();

    // Store the ticket in the tickets table
    await db
      .put({
        TableName: "tickets",
        Item: {
          ticketId,
          eventId,
          verified: false,
        },
      })
      .promise();

    return sendResponse(200, {
      success: true,
      event: eventData.Item,
      ticketId,
    });
  } catch (error) {
    return sendError(500, {
      success: false,
      message: "Could not order ticket",
    });
  }
};
