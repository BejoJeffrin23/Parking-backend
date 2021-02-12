const DB = require('../../utils/DB');
const Message = require('./utils/messageModel');
const Message2 = require('./utils/messageModel2');
DB();

exports.handler = async (event) => {
  try {
    let userId = null;
    let user1Id = null;
    let user2Id = null;
    switch (event.type) {
      case 'getInbox':
        userId = event.arguments.userId;
        return await Message2.aggregate([
          {
            $match: {
              $and: [
                {
                  $or: [
                    {
                      receiverId: userId,
                    },
                    {
                      senderId: userId,
                    },
                  ],
                },
              ],
            },
          },
          {
            $addFields: {
              conversationWith: {
                $cond: {
                  if: {
                    $eq: ['$senderId', userId],
                  },
                  then: '$receiverId',
                  else: '$senderId',
                },
              },
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $group: {
              _id: '$conversationWith',
              lastMessage: {
                $first: '$$ROOT',
              },
            },
          },
        ]);
      case 'sendOneMessage':
        return await Message2.create(event.arguments);
      case 'getAllMessages':
        user1Id = event.arguments.user1Id;
        user2Id = event.arguments.user2Id;
        return await Message2.find({
          $or: [
            {
              senderId: user1Id,
              receiverId: user2Id,
            },
            {
              senderId: user2Id,
              receiverId: user1Id,
            },
          ],
        });
      case 'getDistinctListingsFromMessages':
        return await Message.distinct('listingId');
      case 'getDriverOwnerMessagesByListingId':
        return await Message.find({
          $and: [
            { listingId: event.arguments.listingId },
            { driverId: event.arguments.driverId },
            { ownerId: event.arguments.ownerId },
          ],
        });
      case 'getDriverMessages':
        return await Message.find({ driverId: event.arguments.driverId });
      case 'getListingMessages':
        return await Message.find({ listingId: event.arguments.listingId });
      case 'getOwnerMessages':
        return await Message.find({ ownerId: event.arguments.ownerId });
      case 'createMessage':
        return await Message.create(event.arguments);
      default:
        return null;
    }
  } catch (error) {
    throw error;
  }
};
