import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import UserModal  from "../models/userModel.js";
import bcrypt from "bcryptjs"


export const signup= async(req,res)=>{

  try{
    const {fullName,username,password,email} = req.body

    //Check if email is valid using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(!emailRegex.test(email)){
return res.status(400).json({error:"Invalid email format"})
}

//Check if user name already exists
const existingUser = await UserModal.findOne({username});
if(existingUser){
    return res.status(400).json({
        error:"User name is already Taken!!"
    })
}

//Check if email already exists
const existingEmail = await UserModal.findOne({email});
if(existingEmail){
    return res.status(400).json({
        error:"email is already Taken!!"
    })
}

//Hash the password
const salt=await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password,salt)

const newUser = new UserModal({username,fullName,email,password:hashedPassword})

if(newUser){
generateTokenAndSetCookie(newUser._id,res)
await newUser.save()
 res.status(201).json({
    _id:newUser._id,
    username:newUser.username,
    fullName:newUser.fullName,
    email:newUser.email,
    followers:newUser.followers,
    following:newUser.following,
    profileImg:newUser.profileImg,
    coverImg:newUser.coverImg
 })

}else{
    res.status(400).json({
        error:"Invalid User data!!"
    })
}

  }catch(error){
    console.log(error.message)
    res.status(500).json({
        error:"Internal server error ee"
    })
  }
}

export const login= async(req,res)=>{
    res.json({
        data:"login up controller"
    })
}


export const logout= async(req,res)=>{
    res.json({
        data:"logout up controller"
    })
}