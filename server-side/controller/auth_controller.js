import { User, validateEmail } from "../models/user"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import config from 'config'
import _ from 'lodash'

export const authController = async (req, res) => {
    const { error, value } = validateEmail(req.body.username);
    let user;
    if (error) {
        user = await User.findOne({ username: req.body.username })
    }
    else {
        user = await User.findOne({ email: req.body.username })

    }
    if (!user) {
        return res.status(400).json("Invalid username or password")
    }
    try {
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (validPassword) {
            const token = jwt.sign({ user: user }, config.get('PrivateKey'));
            res.header('x-auth-token', token).send({ ..._.pick(user, ['_id', 'username', 'email']), token: token });
        }
        else throw new Error()
    }
    catch (error) {
        return res.status(400).json("Invalid username or password");

    }


}