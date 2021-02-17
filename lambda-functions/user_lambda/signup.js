const { CognitoIdentityServiceProvider } = require('aws-sdk');

const handler = async (event) => {
  const userPoolId = event.userPoolId;
  const trigger = event.triggerSource;
  const email = event.request.userAttributes.email;
  const name = event.request.userAttributes.name;
  const picture = event.request.userAttributes.picture;
  // const emailVerified = event.request.userAttributes.email_verified;
  const identity = event.userName;
  const client = new CognitoIdentityServiceProvider();

  if (trigger === 'PreSignUp_ExternalProvider') {
    await client
      .listUsers({
        UserPoolId: userPoolId,
        AttributesToGet: ['email', 'name', 'picture'],
        Filter: `email = "${email}"`,
      })
      .promise()
      .then(({ Users }) =>
        Users.sort((a, b) => (a.UserCreateDate > b.UserCreateDate ? 1 : -1))
      )
      .then((users) => (users.length > 0 ? users[0] : null))
      .then(async (user) => {
        // user with username password already exists, do nothing
        if (user) {
          return user;
        }

        // user with username password does not exists, create one
        const newUser = await client
          .adminCreateUser({
            UserPoolId: userPoolId,
            Username: email,
            MessageAction: 'SUPPRESS', // dont send email to user
            UserAttributes: [
              {
                Name: 'name',
                Value: name,
              },
              {
                Name: 'picture',
                Value: picture,
              },
              {
                Name: 'email',
                Value: email,
              },
              {
                Name: 'email_verified',
                Value: 'true',
              },
            ],
          })
          .promise();
        // gotta set the password, else user wont be able to reset it
        await client
          .adminSetUserPassword({
            UserPoolId: userPoolId,
            Username: newUser.Username,
            Password:
              Math.random().toString(36).slice(2) +
              Math.random().toString(36).toUpperCase().slice(2),
            Permanent: true,
          })
          .promise();

        return newUser.Username;
      })
      .then((username) => {
        // link external user to cognito user
        const split = identity.split('_');
        const providerValue = split.length > 1 ? split[1] : null;
        const provider = ['Google', 'Facebook'].find(
          (val) => split[0].toUpperCase() === val.toUpperCase()
        );

        if (!provider || !providerValue) {
          return Promise.reject(new Error('Invalid external user'));
        }

        return client
          .adminLinkProviderForUser({
            UserPoolId: userPoolId,
            DestinationUser: {
              ProviderName: 'Cognito',
              ProviderAttributeValue: username,
            },
            SourceUser: {
              ProviderName: provider,
              ProviderAttributeName: 'Cognito_Subject',
              ProviderAttributeValue: providerValue,
            },
          })
          .promise();
      });
  }
  return event;
};

module.exports = {
  handler,
};
