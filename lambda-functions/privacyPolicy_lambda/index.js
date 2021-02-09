const ObjectId = require('mongodb').ObjectID;
const DB = require('../../utils/DB');
const PolicyModel = require('./utils/privacyPolicyModel');
DB();

exports.handler = async (event) => {
  console.log("lambda",event);
  try {
    switch (event.type) {
      case 'getOnePrivacyPolicy':
        return await PolicyModel.findById(event.arguments.id);
      
      case 'updateOnePrivacyPolicy':
        return await PolicyModel.findByIdAndUpdate(
          event.arguments.id,
          {
            ...event.arguments,
            details: event.arguments.details,
            updatedAt: new Date(),
          },
          {
            new: true,
            runValidators: true,
          }
        );
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
