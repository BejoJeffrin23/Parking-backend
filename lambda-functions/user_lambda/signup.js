const mongoose = require('mongoose');
const DB = require('../../utils/DB');
const User = require('./utils/userModel');
const cognito = require('../common_lambda/utils/Cognito');
DB();

exports.handler = async () => {
  try {
    if (event.triggerSource) {
      console.log('Pre Sign up Event', event);
      if (event.userName.includes('Facebook')) {
        event.request.userAttributes.picture =
          event.request.userAttributes.picture.data.url;
      }
      tempCognitoUser = await cognito.listUsers({
        email: event.request.userAttributes.email,
      });
      userFlag =
        tempCognitoUser &&
        tempCognitoUser.Users &&
        tempCognitoUser.Users[0] &&
        tempCognitoUser.Users[0].Username;
      if (!userFlag) {
        if (event.triggerSource == 'PreSignUp_ExternalProvider') {
          let [providerName, providerUserId] = event.userName.split('_');
          let tempUsername = await cognito.adminCreateNativeUserAndLink({
            name: event.request.userAttributes.name,
            email: event.request.userAttributes.email,
            picture: event.request.userAttributes.picture,
            providerName,
            providerUserId,
          });
          // tempUser = {
          //   username: tempUsername,
          //   name: event.request.userAttributes.name,
          //   email: event.request.userAttributes.email,
          //   picture: event.request.userAttributes.picture,
          //   createdBy: event.triggerSource,
          // };
          // await User.create(tempUser);
          return event;
          // return 'ACCOUNT_LINKED';
        } else {
          tempUser = {
            username: event.userName,
            name: event.request.userAttributes.name,
            email: event.request.userAttributes.email,
            picture: event.request.userAttributes.picture,
            createdBy: event.triggerSource,
          };
          await User.create(tempUser);
          return event;
        }
      } else if (
        userFlag &&
        event.triggerSource == 'PreSignUp_ExternalProvider'
      ) {
        // Link User
        let [providerName, providerUserId] = event.userName.split('_');
        await cognito.linkProviderToUser({
          username: tempCognitoUser.Users[0].Username,
          providerName,
          providerUserId,
        });
        // tempUser = {
        //   username: event.userName,
        //   name: event.request.userAttributes.name,
        //   email: event.request.userAttributes.email,
        //   picture: event.request.userAttributes.picture,
        //   createdBy: event.triggerSource,
        // };
        // await User.create(tempUser);
        // throw new Error('ACCOUNT_LINKED');
        return event;
        // return 'ACCOUNT_LINKED';
      } else if (
        (userFlag && event.triggerSource == 'PreSignUp_SignUp') ||
        event.triggerSource == 'PreSignUp_AdminCreateUser'
      ) {
        return 'User already exists with this email';
      }
    }
  } catch (error) {
    console.log('Error', error);
    throw error;
  }
};
