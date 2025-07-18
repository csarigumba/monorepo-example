exports.handler = async (event, context) => {
  console.log('Hello from User Service Lambda!');
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from User Service!',
      timestamp: new Date().toISOString(),
      requestId: context.awsRequestId
    })
  };
};