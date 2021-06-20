import router from './router'
import {authController} from '../controller/auth_controller'

router.get('/auth', authController)

export default router;