import mongoose from 'mongoose'
import {User} from './user';
import { ChatMessage } from './chatMessage';
import chatRoom from './chatRoom';

const database= {};
database.mongoose=mongoose;
database.user = User;
database.chatRoom= chatRoom;
database.chatMessage= ChatMessage;


export default database