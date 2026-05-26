const { DynamoDBClient, DeleteItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: process.env.REGION });

module.exports.handler = async (event) => {
  const { id } = event.pathParameters;

  const existing = await client.send(
    new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: { S: id } },
    })
  );

  if (!existing.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Task not found" }),
    };
  }

  await client.send(
    new DeleteItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: { S: id } },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Task deleted successfully",
      id,
    }),
  };
};