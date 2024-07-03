//Check if user is authorized or not

import UserModal from "../models/userModel.js";
import jwt from "jsonwebtoken"

export const protectedRoute= async(req,res,next)=>{
    try{ 
        //Get jwt from cookies and save it in new variable token
        const token= req.cookies.jwt;
        //check if the token exist 
        if(!token){
            res.status(401).json({error:"Unauthorized: No token provided"})
        } 
        //Check if token not temperd with
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        //If the token is changed or expired
        if(!decoded){
            return res.status(401).json({error:"Unauthorized: Invalid token"})
        }
        //user to find the user in the db tat match the token and remove the password field
        const user = await UserModal.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        //Add the user to the rerquest object
        req.user = user;
        next()
    }catch(error){
        console.log("Error in protected routes",error.message)
        res.status(500).json({
            error:"Internal server error"
        })

    }
}