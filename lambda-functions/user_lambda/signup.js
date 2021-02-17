const mongoose = require('mongoose');
const DB = require('../../utils/DB');
const User = require('./utils/userModel');
const cognito = require('../common_lambda/utils/Cognito');
DB();

exports.handler = async (event) => {
  try {
    let existingUser = null;
    if (event.triggerSource) {
      console.log('Pre Sign up Event', event);
      if (event.triggerSource == 'PreSignUp_ExternalProvider') {
        existingUser = await cognito.listUsers({
          email: event.request.userAttributes.email,
        });
        console.log('existingUser', existingUser);
        console.log('event.userPoolId', event.userPoolId);
        console.log('process.env.USER_POOL_ID', process.env.USER_POOL_ID);
        console.log('check == ', event.userPoolId == process.env.USER_POOL_ID);
        if (
          existingUser &&
          existingUser.Users &&
          existingUser.Users.length > 0
        ) {
          const [providerName, providerUserId] = event.userName.split('_');
          await cognito.linkProviderToUser({
            username: existingUser.Users[0].Username,
            providerName,
            providerUserId,
          });
          return event;
        } else {
          return event;
        }
      } else {
        return event;
      }
    }
  } catch (error) {
    console.log('Error', error);
    throw error;
  }
};
