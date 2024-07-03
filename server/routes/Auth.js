import express from 'express';
import { getMe, login, logout, signup } from "../controllers/authContrroller.js";
import { protectedRoute } from '../Middleware/protectedRoute.js';


//Create router
const router = express.Router()

router.get("/me",protectedRoute,getMe)
router.post("/signup", signup)
router.post("/login",login )
router.post("/logout", logout)





export  {router as authRoutes}