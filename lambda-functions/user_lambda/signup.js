const DB = require('../../utils/DB');
const User = require('./utils/userModel');
const Cognito = require('../common_lambda/utils/Cognito');
DB();

exports.handler = async (event) => {
  try {
    if (event.triggerSource) {
      console.log('Pre Sign up Event', event);
      let existingUser = null;
      const userPoolId = event.userPoolId;
      const email = event.request.userAttributes.email;
      const name = event.request.userAttributes.name;
      const picture = event.request.userAttributes.picture;
      const username = event.userName;
      if (event.triggerSource == 'PreSignUp_ExternalProvider') {
        let [providerName, providerUserId] = username.split('_');
        providerName = ['Google', 'Facebook'].find(
          (val) => providerName.toUpperCase() === val.toUpperCase()
        );
        existingUser = await cognito.listUsers({
          userPoolId,
          email,
        });
        if (
          existingUser &&
          existingUser.Users &&
          existingUser.Users.length > 0
        ) {
          return await Cognito.linkProviderToUser({
            username: existingUser.Users[0].Username,
            providerName,
            providerUserId,
          });
        } else {
          return await cognito.adminCreateNativeUserAndLink({
            name,
            email,
            picture,
            providerName,
            providerUserId,
          });
        }
      } else {
        await User.create({
          username,
          name,
          email,
          picture,
          createdBy: event.triggerSource,
        });
        return event;
      }
    }
  } catch (error) {
    console.log('Error', error);
    throw error;
  }
};
