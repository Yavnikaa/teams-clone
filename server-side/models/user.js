import Joi from 'joi'
import mongoose from 'mongoose'

export const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 6, maxlength: 50 },
    password: { type: String, required: true, minlength: 6, maxlength: 1024 },
    email: { type: String, minlength: 5, maxlength: 255, required: true, unique: true },
    bio: { type: String }
}))

export const validateUser = (user) => {
    const schema = Joi.object({
        username: Joi.string().min(6).max(50).required(),
        password: Joi.string().min(6).max(1024).required(),
        email: Joi.string().min(3).max(255).required().email(),
        bio: Joi.string()
    })

    return schema.validate(user);
}
export const validateEmail = (email) => {
    const schema = Joi.string().email({ minDomainSegments: 2 });
    return schema.validate(email);
}