import express, { urlencoded } from "express"
import mongoose from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multr"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"
import bodyParser from "body-parser"

//Create app object
const app =express();

//*********Middlewares*************
app.use(express.json())

//Helmet helps in securing HTTP
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
//Morgan is used to for logging http request
app.use(morgan("common"))
//Cookie parser simplifies handling of cookies

//Body-parser enable you to customize how it manages request and responses
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(bodyParser.urlencoded.json({limit:"30mb",extended:true}))

//Allow communication between applications
app.use(cors())
//Environment variable
dotenv.config()

//Configuring for storing files locally
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use("/asset",express.static(path.join(__dirname,'public/assets')))

//Setup file sorage using multer library
const storage = multer.disStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets") //if someone uploads a file is going to be saved in to this folder
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
})
//this will help us save the file
const upload = multer({storage})

app.listen(PORT,=>{
    console.log
})