import mongoose from 'mongoose';
import { v4 as uuidv4 } from "uuid";

const MESSAGE_TYPES = {
    TYPE_TEXT: "text",
};

const readByRecipientSchema = new mongoose.Schema(
    {
      _id: false,
      readByUserId: String,
      readAt: {
        type: Date,
        default: Date.now(),
      },
    },
    {
      timestamps: false,
    }
);

export const ChatMessage = mongoose.model('ChatMessage', new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4().replace(/\-/g, ""),
      },
      chatRoomId: String,
      message: mongoose.Schema.Types.Mixed,
      type: {
        type: String,
        default: () => MESSAGE_TYPES.TYPE_TEXT,
      },
      postedByUser: String,
      readByRecipients: [readByRecipientSchema],
},
{
    timestamps:true,
    collection: "chatmessages",
}))

