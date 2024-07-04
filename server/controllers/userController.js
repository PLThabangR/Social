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