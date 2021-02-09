const ObjectId = require('mongodb').ObjectID;
const DB = require('../../utils/DB');
const PrivacyPolicy = require('./utils/privacyPolicyModel');
DB();

exports.handler = async (event) => {
  try {
    switch (event.type) {
      case 'getOnePrivacyPolicy':
        return await PrivacyPolicy.findById(ObjectId(process.env.PRIVACYPOLICY_ID));
      
      case 'updateOnePrivacyPolicy':
        return await PrivacyPolicy.findByIdAndUpdate(

          ObjectId(process.env.PRIVACYPOLICY_ID),
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
