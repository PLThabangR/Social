import express from 'express';
import { protectedRoute } from '../Middleware/protectedRoute.js';
import { getNotifications ,deleteNotifications} from '../controllers/notificationController.js';


//Create router
const router = express.Router()

router.get('/',protectedRoute,getNotifications)
router.delete('/',protectedRoute,deleteNotifications)



export  {router as notificationRoutes}