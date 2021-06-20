import router from './router'
import MeController from '../controller/me'
import {registrationController} from '../controller/user_controller'

router.get('/me', MeController)
router.get('/register', registrationController)

export default router;