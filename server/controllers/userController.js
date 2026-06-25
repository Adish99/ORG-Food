const User = require("../models/User");

//User Register Controller
const registerController=async(req,res)=>{
    try{
        const {username,email,password,phone,address}=req.body;
        const emailExits=await User.findOne({email});
        if(emailExits){
        return res.status(400).json({message:"Email already exists!"});
        }
        const userData=await User.create({username,email,password,phone,address});
        userData.password=undefined;
        return res.status(201).json({
            message:"Registered Successfully.",
            data:userData,
            userId:userData._id.toString(),
            token: userData.generateUserToken()
        });
    }catch(error){
        console.log("user registerController error:",error);
        return res.status(500).json({message:"Internal server error!"});
    }
}

//User login Controller
const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const userVerify=await User.findOne({email});
        if(!userVerify){
            return res.status(400).json({message:"Login not found! please register first."});
        }
        // Password verification by custom methods
        const passwordCompared=await userVerify.passwordVerify(password);
          if (!passwordCompared) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        
        if(passwordCompared){
            console.log(`Welcome dear ${userVerify.username}`);
            return res.status(200).json({
                message:"Login Successfully.",
                userId:userVerify._id.toString(),
                token: userVerify.generateUserToken()
            });
        }
    }catch(error){
        console.log("Login controller's error:",error);
        return res.status(404).json({message:"Login credentails failed!"});
    }
}

//Authenticate users data controller
const userDataController=async(req,res)=>{
    try{
        const userData=req.user;
        console.log(userData);
        res.status(200).json(userData);
    }catch(error){
        console.log("userDataControllers error:",error);
        res.status(400).json({message:"No user found!"});
    }
}

module.exports={registerController,loginController,userDataController};