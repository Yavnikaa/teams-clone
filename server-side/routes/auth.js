import router from './router'
import {authController} from '../controller/auth_controller'

router.post('/auth', authController)

export default router;