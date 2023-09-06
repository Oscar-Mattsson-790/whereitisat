const { sendResponse } = require("../../responses/index");
const { db } = require("../../services/db");
const { nanoid } = require("nanoid");

async function order(ticketId, eventId) {
  await db
    .put({
      TableName: "tickets",
      Item: {
        ticketId: ticketId,
        eventId: eventId,
        verified: false,
      },
    })
    .promise();
}

async function getEvent(eventId) {
  const { Item } = await db
    .get({
      TableName: "events",
      Key: {
        id: eventId,
      },
    })
    .promise();

  return Item;
}

exports.handler = async (event, context) => {
  const eventId = event.pathParameters.eventId;

  try {
    const ticketId = nanoid();

    const eventDetail = await getEvent(eventId);

    if (!eventDetail)
      return sendResponse(404, { success: false, error: "Event not found" });

    await order(ticketId, eventId);

    return sendResponse(200, {
      success: true,
      ticketId: ticketId,
      event: eventDetail,
    });
  } catch (error) {
    console.log(error);
    return sendResponse(500, {
      success: false,
      error: "Could not order ticket",
    });
  }
};
