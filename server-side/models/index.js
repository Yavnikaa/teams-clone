import mongoose from 'mongoose'
import { User } from './user';
import { ChatMessage } from './chatMessage';

const database = {};
database.mongoose = mongoose;
database.user = User;
database.chatMessage = ChatMessage;


export default database