import mongoose from 'mongoose'
import {User} from './user';
import {ChatRoom} from './chatRoom';
import { ChatMessage } from './chatMessage';

const database= {};
database.mongoose=mongoose;
database.user = User;
database.chatRoom= ChatRoom;
database.chatMessage=ChatMessage;


export default database