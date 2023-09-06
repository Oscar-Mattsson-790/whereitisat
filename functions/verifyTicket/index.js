const { sendResponse } = require("../../responses/index");
const { db } = require("../../services/db");

async function getTicket(ticketId) {
  const { Item } = await db
    .get({
      TableName: "tickets",
      Key: { ticketId },
    })
    .promise();

  return Item;
}

async function verify(ticketId) {
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
}

exports.handler = async (event, context) => {
  const ticketId = event.pathParameters && event.pathParameters.ticketId;

  console.log("Received ticketId:", ticketId);

  try {
    const ticket = await getTicket(ticketId);

    if (!ticket) {
      return sendResponse(404, { success: false, error: "Ticket not found" });
    }

    if (ticket.verified) {
      return sendResponse(400, {
        success: false,
        error: "Ticket already verified",
      });
    }

    await verify(ticketId);

    return sendResponse(200, {
      success: true,
      message: "Ticket verified successfully",
    });
  } catch (error) {
    console.log("Error verifying ticket:", error);
    return sendResponse(500, {
      success: false,
      error: "Could not verify ticket",
    });
  }
};
