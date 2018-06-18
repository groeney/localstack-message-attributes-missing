Steps to reproduce.

---

Create sns topic 'events':
`awslocal sns create-topic --name events`

---
`publisher.js`
```
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
```

Create publish lambda function:
```
awslocal lambda delete-function --function-name=Publisher
zip -r Publisher.zip .
awslocal lambda create-function --function-name=Publisher --runtime=nodejs8.10 --role=arn:aws:iam:local --handler=index.lambda_handler --zip-file=fileb://Publisher.zip
```
---
`consumer.js`
```
console.log("Loading function Echo consumer...");

exports.lambda_handler = function(event, context) {
  console.log(`Event received: ${JSON.stringify(event)}`);
};
```

Create consumer lambda function:
```
awslocal lambda delete-function --function-name=Consumer
zip -r Consumer.zip .
awslocal lambda create-function --function-name=Consumer --runtime=nodejs8.10 --role=arn:aws:iam:local --handler=index.lambda_handler --zip-file=fileb://Consumer.zip
```
---

Subscribe consumer to sns topic:

```
awslocal sns subscribe --topic-arn arn:aws:sns:us-east-1:123456789012:events --protocol lambda --notification-endpoint arn:aws:lambda:us-west-2:000000000000:function:Consumer
```
---

Invoke Publisher:

```
awslocal lambda invoke --invocation-type RequestResponse --function-name Publisher ./outfile.txt
```

