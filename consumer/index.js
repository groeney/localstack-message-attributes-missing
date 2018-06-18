console.log("Loading function Echo consumer...");

exports.lambda_handler = function(event, context) {
  console.log(`Event received: ${JSON.stringify(event)}`);
};