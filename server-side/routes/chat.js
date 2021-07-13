import router from './router'
import { messagesController, sendController } from '../controller/chat'

router.post('/send', sendController)
router.get('/messages', messagesController)

export default router