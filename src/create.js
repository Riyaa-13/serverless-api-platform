const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { randomBytes } = require("crypto");

const client = new DynamoDBClient({ region: process.env.REGION });

const generateId = () => randomBytes(16).toString("hex");

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  if (!body.title) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Title is required" }),
    };
  }

  const task = {
    id: { S: generateId() },
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