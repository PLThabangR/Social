import path from "path";
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
import { authRoutes } from "./routes/Auth.js";
import { userRoute } from "./routes/userRoutes.js";

//Create app object
const app =express();

//*********Middlewares*************
app.use(express.json()) //Runs between request and responds to parse req.body
app.use(express.urlencoded({extended:true})) //to parse form data(urlencoded)
app.use(cookieParser())
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
    console.log(`Server running on port ${port}`)
    
    
})

//CAlling routes
//Authentication route
app.use("/api/auth",authRoutes)
//user Route
app.use("/api/user",userRoute)