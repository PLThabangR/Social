import express from 'express';
import { login, logout, signup } from '../controllers/authContrroller.js';

//Create router
const router = express.Router()


router.post("/signup", signup)
router.post("/login",login )
router.post("/logout", logout)




export  {router as authRoutes}