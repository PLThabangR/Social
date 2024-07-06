import PostModel from "../models/postSModel.js"
import UserModal from "../models/userModel.js"

//import packages
import {v2 as cloudinary} from "cloudinary"



export const createPost =async(req,res)=>{
    try{
        const {text} = req.body
        let {img} = req.body
        const userId = req.user._id.toString()
        //Check if user exist
        const user = await UserModal.findById(userId)
        if(!user) return res.satus(404).json({message:"User not found"})
        //Check if text or image exist
        if(!text && !img){
            return req.status(400).json({error:"Post must have text or image"})
        }
        //Upload the new image to cloudinary
        if(img){
            const uploadResponse = await Cloudinary.uploader.upload(img);
            img = uploaderResponse.secure_url;
        }

        //Create new post
        const newPost = new PostModel({
            user:userId,
            text,
            img
        })
        //Save the new post to the DB
        await newPost.save()
        //Return results to the user
        res.status(201).json(newPost)

    }catch(err){
        console.log("Error in create",error.message)
        res.status(500).json({
            error:error.message
        }) 
    }

}