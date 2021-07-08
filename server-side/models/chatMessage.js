import mongoose, { Schema } from 'mongoose';

export const ChatMessage = mongoose.model('ChatMessage', new mongoose.Schema({
  chatRoomId: { type: String, required: true },
  message: mongoose.Schema.Types.Mixed,
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' }
},
  {
    timestamps: true,
    collection: "chatmessages",
  }
))

