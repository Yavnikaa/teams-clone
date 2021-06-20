import {User, validateUser} from "../models/user"

export const registrationController = async (req,res) => {
    const {error,value} = validateUser(req.body);

    if (error){
        return res.status(400).json(error)
    }

    let user= await User.findOne({username:req.body.username})

    if(user){
        return res.status(400).json(" User exists.")
    } else {
        user= new User(value);
        await user.save();
        return res.json(user);
    }
}

