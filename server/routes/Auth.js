import express from 'express';
import { login, logout, signup } from "../controllers/authContrroller.js";
import { protectedRoute } from '../Middleware/protectedRoute.js';

//Create router
const router = express.Router()


router.post("/signup", signup)
router.post("/login",login )
router.post("/logout", logout)
router.get("/me",protectedRoute)




export  {router as authRoutes}