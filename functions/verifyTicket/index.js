const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");

exports.handler = async (event, context) => {
  const ticketId = event.pathParameters.ticketId;

  try {
    const ticketData = await db
      .get({
        TableName: "tickets",
        Key: { ticketId },
      })
      .promise();

    if (!ticketData.Item) {
      return sendError(404, { success: false, message: "Ticket not found" });
    }

    if (ticketData.Item.verified) {
      return sendError(400, {
        success: false,
        message: "Ticket already verified",
      });
    }

    // Mark ticket as verified
    await db
      .update({
        TableName: "tickets",
        Key: { ticketId },
        UpdateExpression: "SET verified = :verifiedValue",
        ExpressionAttributeValues: {
          ":verifiedValue": true,
        },
      })
      .promise();

    return sendResponse(200, {
      success: true,
      message: "Ticket verified successfully",
    });
  } catch (error) {
    return sendError(500, {
      success: false,
      message: "Could not verify ticket",
    });
  }
};
