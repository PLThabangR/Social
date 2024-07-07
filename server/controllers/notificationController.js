import notificationModal from "../models/notification.js";

export const getNotifications = async(req,res)=>{

    try{
       //Get the logged user
       const userId = req.user._id;
      
       //Find all notification for this user
       const notification = await notificationModal.find({to:userId}).populate({
        path: "from",
        select:"username profileImg"
       })
     
       //Update Notification then
       await notificationModal.updateMany({to:userId},{read:true})

       res.status(200).json(notification)

    }catch(error){
    console.log("Error in getNotifications controller: ", error);
    res.status(500).json({ error: "Internal server error" });
}
}

export const deleteNotifications=async(req,res)=>{
    console.log("In notifications")
    try{
        //Get the logged user
        const userId = req.user._id;
        
        //Delete all notification for this user
        await notificationModal.deleteMany({to:userId})
      
 
        res.status(200).json("Notification deleted successfully")
 
     }catch(error){
     console.log("Error in deleteNotifications controller: ", error);
     res.status(500).json({ error: "Internal server error" });
 }

}

