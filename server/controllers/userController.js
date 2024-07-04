//Models
import notificationModal from "../models/notification.js";
import UserModal from "../models/userModel.js";

//Packeges
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary"


export const getUserProfile=async (req,res)=>{
    //Get user name from paprams
const {username} = req.params
try{
    const user = await UserModal.findOne({username}).select("-password")
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    res.status(200).json(user)

}catch(error){
    console.log("Error from getUser",error.message)
    res.status(500).json({
        error:error.message
    })
}
}


export const followUnfollow = async (req,res)=>{
    try{
        const {id} = req.params

        //find user to follow by id
        const userToModify = await UserModal.findById(id)
        //Find information about my self
        const currentUser = await UserModal.findById(req.user._id)
        
        //Check if user trying to follow himself
        //set req.user._id to string as it is an  object
        if(id===req.user._id.toString()){
            return res.status(404).json({error:"You cannot follow/unfollow yourself"})
        }
        //Check if user is found
        if(!userToModify || !currentUser){
            return res.status(404).json({error:"User not found"})
        }

        //Check if the  following array includes the  id of user to modify
        const isFollowing = currentUser.following.includes(id)
        
        if(isFollowing){
            //unfollow user 
            //Update the arrays followers and follows array of both users using $pull
            await UserModal.findByIdAndUpdate(id,{$pull:{followers:req.user._id}})
            await UserModal.findByIdAndUpdate(req.user._id,{$pull:{following:id}})
            
          
            //Return the id of the user to the client
            res.status(200).json({message:"User unfollowed successfully"})


        }else{
            //follow user
            //Update the arrays followers and follows array of both users using $push 
            await UserModal.findByIdAndUpdate(id,{$push:{followers:req.user._id}})
            await UserModal.findByIdAndUpdate(req.user._id,{$push:{following:id}})

              //Send notification to user
              const newNotification= new notificationModal({
                type:"follow",
                from: req.user._id,
                to:userToModify._id
            })
            //Save the new notification to the database
            await newNotification.save()
            res.status(200).json({message:"User followed successfully"})
        }



    }catch(error){
        console.log("Error from folowUnfollow",error.message)
        res.status(500).json({
            error:error.message
        })
    }
}

export const getSuggestedUsers = async (req,res)=>{
  
    try{
            //Exclude our self from sidebar and users that we already follow
            //Get my user id
            const userId = req.user._id;

            //get list of people I follow
            const userFollowedByMe = await UserModal.findById(userId).select("following")

            //Exlcude  yourself and get ten users using aggregate
            const users = await UserModal.aggregate([
                {$match:{
                    _id:{$ne:userId}, //match where _id is not equals to userId
                }
                },
                {$sample:{size:10}}, //we would like to get 10 diffierent users
                
            ]);
 
            //Exclude user followed by me using this basic function  becuase the aggregate will return 10 sample
            //This will filter out users Id follow
            const filteredUsers = users.filter((user)=>!userFollowedByMe.following.includes(user._id))
            
            //slice the filtered users to get only 4 users back
          const  suggestedUsers = filteredUsers.slice(0,4)
          console.log("Filterfollowing users",suggestedUsers)
            //Remove passwords from users not in the db just this  respond
            suggestedUsers.forEach((user)=> user.password=null)

            
            // Return the list of suggested users
            res.status(200).json(suggestedUsers)
    }catch(error){
   console.log("Error in suggested user",error.message)
        res.status(500).json({
            error:error.message
        })
    }

}

export const updateUSerProfile = async (req,res) =>{
    //Get ner user details
    const {fullName,email,username,currentPassword,newPassword,bio,link} =  req.body;
    let {profileImg,coverImg}=  req.body;
     //Get my user id
     const userId = req.user._id;
    
    try{ 
         let user = await UserModal.findById(userId)
         if(!user) return res.status(404).json({error:"User not found"})

        //Check if password is provided
        if((!newPassword && currentPassword) || (!currentPassword && newPassword)){
            return res.status(404).json({error:"Please provide both current and passweord and new password"})
        }
        //Compare current paassword and DB password then hash and update
        if(currentPassword && newPassword){
            const isMatch = await bcrypt.compare(currentPassword,user.password)
            if(!isMatch) return res.status(400).json({error:"Current password is incorrect"})
                const salt =  await bcrypt.genSalt(10)
            //Hash and Set new password 
            user.password = await bcrypt.hash(newPassword,salt)

        }
        

        //upload to cloudinary
        if(profileImg){
            //If the is already a profileImg destroy it and upload a new one
            // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
            if(user.profileImg){
                await cloudinary.uploader.destroy(use.profileImg.split("/").pop().split(".")[0])
            }
            //Use this method to upload
            const uploadResponse = await cloudinary.uploader.upload(profileImg);
            //Set the url to profileImg
            profileImg = uploadResponse.secure_url;
        }


        if(coverImg){
             //If the is already a profileImg destroy it and upload a new one
            // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
            if(user.coverImg){
                await cloudinary.uploader.destroy(use.coverImg.split("/").pop().split(".")[0])
            }
            //Use this method to upload
            const uploadResponse = await cloudinary.uploader.upload(coverImg);
            //Set the url to profileImg
            coverImg = uploadResponse.secure_url;
        }
        //Assign value 
        user.fullName = fullName || user.fullName;
        user.email =  email || user.email;
        user.username= username || user.username;
        user.bio = bio || user.bio;
        user.link= link || user.link
        user.profileImg= profileImg || user.profileImg;
        user.coverImg = coverImg || user.coverImg;
        console.log(user.fullName,user.email)
        
        //save to the db 
        user = await user.save()
      
        //do not return the password in the response
        user.password =null
        return res.status(200).json({user})
    }catch(error){
        console.log("Error in update user",error.message)
        res.status(500).json({
            error:error.message
        }) 
    }
}