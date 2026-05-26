const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: process.env.REGION });

module.exports.handler = async (event) => {
  const result = await client.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );

  const tasks = result.Items.map((item) => ({
    id: item.id.S,
    title: item.title.S,
    description: item.description.S,
    status: item.status.S,
    createdAt: item.createdAt.S,
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({
      count: tasks.length,
      tasks,
    }),
  };
};