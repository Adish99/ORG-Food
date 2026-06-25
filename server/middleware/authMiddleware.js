const jwt=require("jsonwebtoken");
const User = require("../models/User");

// User Authentication middleware
const authMiddleware=async(req,res,next)=>{
    const token=req.header("Authorization");
    if(!token){
        return res.status(401).json({message:"No authenticate Token found!"});
    }
    const orgToken=token.replace("Bearer","").trim();
    try{
const verifiedData=jwt.verify(orgToken,process.env.SECRET_KEY);
const userData=await User.findOne({email:verifiedData.email}).select({password:0});
if(!userData){
    return res.status(404).json({message:"User not found!"});
}
req.user=userData;
next();
    }catch(error){
    console.log("User Authentication middleware error:",error);

    return res.status(401).json({
        message:"Invalid Token"
    });
}
}

module.exports=authMiddleware;