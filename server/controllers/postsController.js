import notificationModal from "../models/notification.js"
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
        //Find post from database using id
      const post=  await PostModel.findById(req.params.id)
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        //Check if user is authorized to delete this meaning auth
        //user is a ID in the post model
        if(req.user._id.toString() !== post.user.toString()){
            
            return res.status(401).json({error:"You are not authorized to delete this post"})
        }
        ////If the is already a profileImg destroy it and upload a new one
         // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
            if(post.img){
                //Get the image ID
             const imgID =  post.img.split("/").pop().split(".")[0]
            //Delete image from cloudinary 
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

export const commentPost = async (req,res)=>{

    try{
        const {text} = req.body
        const postId= req.params.id
        const userId =req.user._id

        if(!text){
            return res.status(400).json({error:"Text field is required"})
        }
        //find post by ID
        const post = await PostModel.findById(postId) 
        //Check post exist
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        //Create new comment 
        const comment={user:userId,text};
        //Push new comments to the array ofthe model
       post.comments.push(comment)
    //Save to the DB
        await post.save()
        //@200 created
        res.status(200).json(post)
    }catch(error){
        console.log("Error in comment post",error.message)
        res.status(500).json({
            error:error.message
        }) 
    
    }
}

export const likeUnlikePost=async(req,res)=>{
    console.log("In likeUnlike")
    try{
        const userId = req.user._id;
        const postId = req.params.id;

        const post =await PostModel.findById(postId) 
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        console.log("userloke0")
        //check if the post includes the id
        const userLikeDPost = post.likes.includes(userId)
        console.log("userloke1")
        if(userLikeDPost){
            //Unlike the post
            await PostModel.updateOne({_id:postId},{$pull:{likes:userId}})
            res.status(200).json({message:"Post unliked successfully"})
        }else{
            post.likes.push(userId)
            await post.save()

            //Send notification to the user
            const notification= new notificationModal({
                from: userId,
                to:post.user,
                type:"like"
            })

            notification.save()

            const updatedLikes = post.likes;
			res.status(200).json(updatedLikes);
        }
    }catch(error){
        console.log("Error in likeUnlike",error.message)
        res.status(500).json({
            error:error.message
        }) 
    }

}

export const getAllPosts = async(req,res)=>{
    console.log("Welcome to get all")
try{

    const posts = await PostModel.find().sort({createdAt:-1}).populate({
        path:"user",
        select:"-password"
    })

    if(posts.length ===0){
        res.status(200).json([]);
    }
 
    res.status(201).json(posts)

}catch(error){
    console.log("Error in getAll Posts",error.message)
    res.status(500).json({
        error:error.message
    }) 
}

}

