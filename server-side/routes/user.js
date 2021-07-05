import router from './router'
import {registrationController} from '../controller/user_controller'

router.post('/register', registrationController)

export default router;