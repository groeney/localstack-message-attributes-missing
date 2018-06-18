console.log("Loading function publisher...");
const sns = new AWS.SNS({ endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4575` });
exports.lambda_handler = async function(event, context) {
  const params = {
    TopicArn: "arn:aws:sns:us-east-1:123456789012:events",
    Subject: "Subject",
    Message: "Message",
    MessageAttributes: {new_image: {DataType: "String", "StringValue": "Value of new_image"}}
  };
  return sns.publish(params).promise()
    .then(data => {
      return `Successfully published to events topic: ${JSON.stringify(data)}`
    })
    .catch(err => {
      return `Could not publish to sns topic: ${err}`
    });
};