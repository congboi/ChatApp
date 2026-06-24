import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const updateConversationAfterCreateMessage = (
  conversation,
  message,
  senderId
) => {
  conversation.set({
    seenBy: [],
    lastMessageAt: message.createdAt,
    lastMessage: {
      _id: message._id,
      content: message.content,
      senderId,
      createdAt: message.createdAt,
    },
  });

  conversation.participants.forEach((p) => {
    const memberId = p.userId.toString();
    const isSender = memberId === senderId.toString();
    const prevCount = conversation.unreadCounts.get(memberId) || 0;
    conversation.unreadCounts.set(memberId, isSender ? 0 : prevCount + 1);
  });
};

export const emitNewMessage = (io, conversation, message) => {
  // QUAN TRỌNG: Phải chuyển Map sang Object để Socket gửi đi đúng định dạng
  const unreadCountsObj = Object.fromEntries(conversation.unreadCounts || new Map());
  
  io.to(conversation._id.toString()).emit("new-message", {
    message,
    conversation: {
      _id: conversation._id,
      lastMessage: {
        _id: message._id,
        content: message.content,
        senderId: message.senderId,
        createdAt: message.createdAt
      },
      lastMessageAt: conversation.lastMessageAt,
      unreadCounts: unreadCountsObj
    },
    unreadCounts: unreadCountsObj,
  });
};