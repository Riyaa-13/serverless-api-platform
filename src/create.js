const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({ region: process.env.REGION });

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  if (!body.title) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Title is required" }),
    };
  }

  const task = {
    id: { S: uuidv4() },
    title: { S: body.title },
    description: { S: body.description || "" },
    status: { S: "pending" },
    createdAt: { S: new Date().toISOString() },
  };

  await client.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: task,
    })
  );

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Task created successfully",
      id: task.id.S,
      title: task.title.S,
      status: task.status.S,
      createdAt: task.createdAt.S,
    }),
  };
};