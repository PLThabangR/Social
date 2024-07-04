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
            res.status(200).json({message:"User unfollowed successfully"})


        }else{
            //follow user
            //Update the arrays followers and follows array of both users using $push 
            await UserModal.findByIdAndUpdate(id,{$push:{followers:req.user._id}})
            await UserModal.findByIdAndUpdate(req.user._id,{$push:{following:id}})
            res.status(200).json({message:"User followed successfully"})
        }



    }catch(error){
        console.log("Error from folowUnfollow",error.message)
        res.status(500).json({
            error:error.message
        })
    }
}