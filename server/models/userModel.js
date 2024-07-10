import { timeStamp } from "console"
import mongoose from "mongoose"
import { type } from "os"

//Create a schema
const userSchema = new mongoose.Schema({
username:{type: String,required:true,unique:true},
fullName:{type:String,required:true},
password:{type:String,required:true,minLength:6},
email:{
    type:String,required:true,unique:true
},
//Followers is gonna be a array
followers:[
   { type : mongoose.Schema.Types.ObjectId,//ID are 16 bytes hex string
    ref:"User",  //This ID will reference a user model,
    default:[],//A user will have empty array meaning zero followers
   } ,
],
//Followering is gonna be a array
following:[
    { type : mongoose.Schema.Types.ObjectId,//ID are 16 bytes hex string
     ref:"User",  //This ID will reference a user model,
     default:[],//A user will have empty array meaning zero followings
    },
 ],
 profileImg:{
    type:String,
    default:"",
 },
 bio:{
    type:String,
    default:""
 },
 link:{
    type:String,
    default:""
 },
 

}
,{timeStamp:true})



//Create a model the schema needs a model
const UserModal = mongoose.model("User",userSchema); //in mongo will look like this users

export default UserModal