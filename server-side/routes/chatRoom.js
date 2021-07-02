import router from './router'
import {initiateChatController} from '../controller/initiate_chat'

router.get('/initiate', initiateChatController)

export default router;