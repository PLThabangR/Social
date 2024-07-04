import notificationModal from "../models/notification.js"
import UserModal from "../models/userModel.js"


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
    try{
        const {id}

    }catch(error){
        console.log("Error in suggested user",error.message)
        res.status(500).json({
            error:error.message
        }) 
    }
}