import express from "express"
import { protectedRoute } from "../Middleware/protectedRoute.js";
import {getUserProfile,followUnfollow} from "../controllers/userController.js"

const router = express.Router()

router.get("/profile/:username",protectedRoute,getUserProfile)
// router.get("/suggested",protectedRoute,getUserProfile)
router.get("/follow/:id",protectedRoute,followUnfollow)
// router.post("/update",protectedRoute,updateUSerProfile)



export {router as userRoute}