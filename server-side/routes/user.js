import router from './router'
import {registrationController} from '../controller/user_controller'

router.get('/register', registrationController)

export default router;