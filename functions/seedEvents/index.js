const { db } = require("../../services/db");
const eventsData = require("../../services/events.json");

exports.handler = async (event, context) => {
  try {
    for (const eventItem of eventsData.events) {
      const params = {
        TableName: "events",
        Item: {
          id: eventItem.id.toString(),
          artist: eventItem.artist,
          date: eventItem.date,
          arena: eventItem.arena,
          time: eventItem.time,
          price: eventItem.price,
        },
      };

      await db.put(params).promise();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Events seeded successfully.",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Failed to seed events.",
      }),
    };
  }
};
