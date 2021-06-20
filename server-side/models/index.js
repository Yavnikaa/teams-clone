import mongoose from 'mongoose'
import {User} from './user';

const database= {};
database.mongoose=mongoose;
database.user = User;

export default database