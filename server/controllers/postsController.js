import PostModel from "../models/postSModel.js"
import UserModal from "../models/userModel.js"

//import packages
import {v2 as cloudinary} from "cloudinary"



export const createPost =async(req,res)=>{
    try{
        //get text form body
        const {text} = req.body
        //We will change this variable when we assign it to cloudinary
        let {img} = req.body
        //Get user id from protect route
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
            const uploadResponse = await cloudinary.uploader.upload(img);
            //we the uploaded image as url
            img = uploadResponse.secure_url;
        }

        //Create new post using post model
        const newPost = new PostModel({
            user:userId,//currently authenticcated uer
            text,
            img
        })
        //Save the new post to the DB
        await newPost.save()
        //Return results to the user
        res.status(201).json(newPost)

    }catch(err){
        console.log("Error in create post",error.message)
        res.status(500).json({
            error:error.message
        }) 
    }

}

export const deletePost = async(req,res)=>{

    try{
        //Find post from database
      const post=  await PostModel.findById(req.params.id)
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        //Check if user is authorized to delete this
        //user is a ID in the post model
        if(req.userId.toString() !== post.user.toString()){
            return res.status(404).json({error:"You are not authorized to delete this post"})
        }
        ////If the is already a profileImg destroy it and upload a new one
         // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
            if(post.img){
                //Get the image ID
             const imgID =  post.img.split("/").pop().split(".")[0]
             
             await cloudinary.uploader.destroy(imgID)
            }
            //Then Delete the post
            await PostModel.findByIdAndDelete(req.params.id)
            //Give response after delete
            res.status(200).json({ message: "Post deleted successfully" });
    }catch(error){
        console.log("Error in delete post",error.message)
        res.status(500).json({
            error:error.message
        }) 
    }

}