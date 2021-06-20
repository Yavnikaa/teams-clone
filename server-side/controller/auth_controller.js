import {User, validateUser} from "../models/user"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import config from 'config'
import _ from 'lodash'

export const authController = async (req,res) => {
    const {error,value} = validateUser(req.body);

    if (error){
        return res.status(400).json(error)
    }

    let user= await User.findOne({email:req.body.email})

    if (!user){
        return res.status(400).json("Invalid username or password")
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).json("Invalid username or password");
    }

    const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'));
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'username', 'email']));

}