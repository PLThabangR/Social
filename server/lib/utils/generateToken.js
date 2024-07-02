import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie=(userId,res)=>{
        //Create a token which expires in 15 days
    const token = jwt.sign({userI},process.env.JWT_SECRET,{
        expiresIn:'15d'
    })

    //respond a token and secure it
    res.cookie("jwt",token,{
        maxAge:15*24*60*60*1000,//MilliSeconds
        httpOnly:true,//Prevent XSS attacks cross-site scripting attacks
        sameSite:"strict",//CSFR attacks cross-site request forgery attacks
        secure:process.env.NODE_ENV !== "developmet"
    })
}