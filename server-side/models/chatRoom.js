import mongoose from 'mongoose';
import { v4 as uuidv4 } from "uuid";

export const CHAT_ROOM_TYPES = {
    CONSUMER_TO_CONSUMER: "consumer-to-consumer",
    CONSUMER_TO_SUPPORT: "consumer-to-support",
};


export const ChatRoom= mongoose.model('ChatRoom', new mongoose.Schema({
    id: {
        type: String,
        default: () => uuidv4().replace(/\-/g, ""),
      },
    userIds: Array,
    type: String,
    chatInitiator: String,
},
{
    timestamps:true,
    collection: "chatrooms"
}));

