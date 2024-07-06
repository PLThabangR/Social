import express from 'express';
import { protectedRoute } from '../Middleware/protectedRoute.js';
import { createPost } from '../controllers/postsController.js';

//Create router
const router = express.Router()

router.post ("/create",protectedRoute,createPost,createPost)
// router.post ("/ike/:id",protectedRoute,likeUnlikePost)
// router.post ("/comment/:id",protectedRoute,commentPost)
// router.post ("/delete",protectedRoute,deletePost)


export  {router as postRoutes}
