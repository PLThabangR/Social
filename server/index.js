import express, { urlencoded } from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

//Create app object
const app =express();

//*********Middlewares*************
app.use(express.json())

//Cookie parser simplifies handling of cookies

//Allow communication between applications
app.use(cors())
//Environment variable
dotenv.config()

//MongoDB connection using vsCode url
const  mongoURl  = process.env.MONGOURL

// Using VsCode url to connect with mongo DBc
mongoose.connect(mongoURl).then(()=> console.log("Connected to MONGODB")).catch((err)=>console.log("Cannot connect to MONGODB",err))

const port = process.env.PORT || 5001;

app.listen(port,()=>{
    console.log(`Server running on por ${port}`)
    
})