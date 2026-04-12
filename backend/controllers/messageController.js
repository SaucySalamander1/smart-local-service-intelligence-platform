const Message = require('../models/Message');
const User = require('../models/User');
const mongoose = require('mongoose');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id; // From auth middleware

    if (!receiverId || !message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and message are required'
      });
    }

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Create and save message
    const newMessage = new Message({
      senderId,
      receiverId,
      message: message.trim(),
      timestamp: new Date()
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user._id; // From auth middleware

    // Fetch all messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    })
      .populate('senderId', 'name profilePicture')
      .populate('receiverId', 'name profilePicture')
      .sort({ timestamp: 1 }); // Oldest first

    // Mark messages as read
    await Message.updateMany(
      { senderId: otherUserId, receiverId: currentUserId, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message
    });
  }
};

// Get all conversations for current user
exports.listConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id; // From auth middleware

    // Get all unique users this person has messaged
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: new mongoose.Types.ObjectId(currentUserId) },
            { receiverId: new mongoose.Types.ObjectId(currentUserId) }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', new mongoose.Types.ObjectId(currentUserId)] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$message' },
          lastTimestamp: { $first: '$timestamp' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $ne: ['$senderId', new mongoose.Types.ObjectId(currentUserId)] },
                  { $eq: ['$read', false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { lastTimestamp: -1 }
      }
    ]);

    // Populate user details
    const populatedConversations = await User.populate(conversations, {
      path: '_id',
      select: 'name profilePicture'
    });

    res.status(200).json({
      success: true,
      data: populatedConversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message
    });
  }
};
