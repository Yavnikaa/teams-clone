import Joi from 'joi'
import mongoose from 'mongoose'

export const User= mongoose.model('User', new mongoose.Schema({
    username: {type: String, required:true, unique:true },
    password: {type: String, required: true},
    name: {type: String, minlength: 3 }
}))

export const validateUser = (user) => {
    const schema= Joi.object ({
        username: Joi.string().required(),
        password: Joi.string().required(),
        name: Joi.string().min(3),
    })
    
    return schema.validate(user);
}