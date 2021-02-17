const AWS = require('aws-sdk');
const UserPoolId = 'us-east-1_WvwYKuosP';

AWS.config.region = 'us-east-1';

AWS.config.apiVersions = {
  cognitoidentityserviceprovider: '2016-04-18',
};

const listUsers = (data) => {
  var params = {
    UserPoolId: data.userPoolId,
    AttributesToGet: ['email', 'name', 'picture'],
    // Filter: `email = \"${data.email}"`,
    Filter: `email = "${data.email}"`,
  };
  return new AWS.CognitoIdentityServiceProvider().listUsers(params).promise();
};

const listUsers = (data) => {
  var params = {
    UserPoolId: data.userPoolId,
    AttributesToGet: ['email', 'name', 'picture'],
    // Filter: `email = \"${data.email}"`,
    Filter: `email = "${data.email}"`,
  };
  return new AWS.CognitoIdentityServiceProvider().listUsers(params).promise();
};

const adminCreateUser = (data) => {
  const params = {
    UserPoolId: data.userPoolId,
    Username: data.email,
    MessageAction: 'SUPPRESS', // dont send email to user
    UserAttributes: [
      {
        Name: 'name',
        Value: data.name,
      },
      {
        Name: 'picture',
        Value: data.picture,
      },
      {
        Name: 'email',
        Value: data.email,
      },
      {
        Name: 'email_verified',
        Value: true,
      },
    ],
  };

  return new AWS.CognitoIdentityServiceProvider()
    .adminCreateUser(params)
    .promise();
};

const adminCreateUserSetPassword = async () => {};

module.exports = {
  listUsers,
  adminCreateUser,
  adminCreateUserSetPassword,
};
