import { User } from "../models/user"

export const allUsersController = async (req, res) => {
  try {
    const users = await User.find().select('_id username bio');
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, error: error })
  }
}