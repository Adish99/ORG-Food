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
    message: "Login Successfully.",
    token: userVerify.generateUserToken(),
    user: {
        _id: userVerify._id,
        username: userVerify.username,
        email: userVerify.email,
        role: userVerify.role
    }
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

const getAllUsersController = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({

            message: "Users fetched successfully.",

            users

        });

    } catch (error) {

        console.log("Get Users Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }
}

// ====================================
// Update User Role
// ====================================

const updateUserRoleController = async (req, res) => {

    try {

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        user.role = user.role === "admin"
            ? "user"
            : "admin";

        await user.save();

        return res.status(200).json({

            message: "User role updated successfully.",

            user

        });

    } catch (error) {

        console.log("Update User Role Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

// ====================================
// Delete User
// ====================================

const deleteUserController = async (req, res) => {

    try {

        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (req.user._id.toString() === id) {

            return res.status(400).json({
                message: "You cannot delete your own account."
            });

        }

        const user = await User.findById(id);

        if (!user) {

            return res.status(404).json({
                message: "User not found."
            });

        }

        
        if (user.role === "admin") {
    return res.status(400).json({
        message: "Admin accounts cannot be deleted."
    });
}

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            message: "User deleted successfully."
        });

    } catch (error) {

        console.log("Delete User Error:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

module.exports={registerController,loginController,userDataController,getAllUsersController,updateUserRoleController,deleteUserController};