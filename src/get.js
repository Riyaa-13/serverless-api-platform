const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: process.env.REGION });

module.exports.handler = async (event) => {
  const { id } = event.pathParameters;

  const result = await client.send(
    new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: { id: { S: id } },
    })
  );

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Task not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      id: result.Item.id.S,
      title: result.Item.title.S,
      description: result.Item.description.S,
      status: result.Item.status.S,
      createdAt: result.Item.createdAt.S,
    }),
  };
};