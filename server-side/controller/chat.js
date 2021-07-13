import { User } from "../models/user"
import { ChatMessage } from "../models/chatMessage"

export const messagesController = async (req, res) => {
    const { recipient } = req.query
    if (recipient) {
        let recipientUser = await User.findOne({ username: recipient })
        if (!recipientUser) res.sendStatus(403)
        else {
            const userArr = [req.user._id, recipientUser.id]
            userArr.sort();
            const messages = await ChatMessage.find({ chatRoomId: `${userArr[0]}---${userArr[1]}` }).sort({ 'updatedAt': -1 })
            res.status(200).json(messages)
        }
    }
    else {
        res.sendStatus(400);
    }
}
export const sendController = async (req, res) => {
    const { recipient } = req.body
    if (recipient) {
        let recipientUser = await User.findOne({ username: recipient })
        if (!recipientUser) res.sendStatus(403)
        else {
            const userArr = [req.user._id, recipientUser.id]
            userArr.sort();
            if (req.body.message) {
                const messageObj = {
                    chatRoomId: `${userArr[0]}---${userArr[1]}`,
                    message: req.body.message,
                    sender: req.user._id,
                    receiver: recipientUser.id
                }
                const message = new ChatMessage(messageObj)
                await message.save()
                return res.json(message)
            }
            else {
                res.sendStatus(400)
            }
        }
    }
    else {
        res.sendStatus(400);
    }
}