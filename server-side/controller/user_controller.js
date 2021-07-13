import { User, validateUser } from "../models/user"
import bcrypt from 'bcrypt'

export const registrationController = async (req, res) => {
    const { error, value } = validateUser(req.body);
    if (error) {
        return res.status(400).json(error)
    }

    let user = await User.findOne({ username: req.body.username })

    if (user) {
        return res.status(400).json({details:[{message:"User exists."}]})
    } else {
        user = new User(value);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        return res.json("Registered successfully");
    }
}

