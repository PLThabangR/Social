import mongoose from "mongoose";


//Create Schema
const postSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    text:{
        type:String
    },
    img:{
        type:String
    },
    likes:[
        {
            types:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    comments:[
        {text:{
            type:String,
            required:true
        },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
    }
    ]

},{timestamps:true})

//Create a model
const PostModel = mongoose.model("Post",postSchema);
export default PostModel;