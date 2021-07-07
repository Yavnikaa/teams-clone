import router from './router'
import {allUsersController} from '../controller/all_users_controller'

router.get('/list', allUsersController)

export default router;