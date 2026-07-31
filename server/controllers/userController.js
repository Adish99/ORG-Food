const User = require("../models/User");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");

// ====================================
// User Register Controller
// ====================================

const registerController = async (req, res) => {

    try {

        const { username, email, password, phone, address } = req.body;

        const emailExists = await User.findOne({ email });

        if (emailExists) {

            return res.status(400).json({
                message: "Email already exists!"
            });

        }

        const userData = await User.create({

            username,
            email,
            password,
            phone,
            address

        });

        // Generate OTP
        const otp = generateOTP();

        userData.otp = otp;

        userData.otpExpires = new Date(
            Date.now() + 10 * 60 * 1000
        );

        userData.isVerified = false;

        await userData.save();

        // Send OTP Email
        await sendEmail(

            userData.email,

            "Verify Your Org-Khana Account",

            `
                <h2>Welcome to Org-Khana 🌱</h2>

                <p>Thank you for registering.</p>

                <p>Your verification code is:</p>

                <h1>${otp}</h1>

                <p>This OTP will expire in 10 minutes.</p>

                <p>If you didn't register, please ignore this email.</p>
            `

        );

        return res.status(201).json({

            message: "Registration successful. Please verify your email.",

            email: userData.email

        });

    } catch (error) {

        console.log("User Register Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

// ====================================
// User Login Controller
// ====================================

const loginController = async (req, res) => {

    try {

        const { email, password } = req.body;

        const userVerify = await User.findOne({ email });

        if (!userVerify) {

            return res.status(400).json({

                message: "Account not found. Please register first."

            });

        }

        // Check if email verified
        if (!userVerify.isVerified) {

            return res.status(401).json({

                message: "Please verify your email before logging in."

            });

        }

        const passwordCompared = await userVerify.passwordVerify(password);

        if (!passwordCompared) {

            return res.status(401).json({

                message: "Invalid credentials."

            });

        }

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

    } catch (error) {

        console.log("Login Controller Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

// ====================================
// Forgot Password Controller
// ====================================

const forgotPasswordController = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                message: "No account found with this email."

            });

        }

        // Don't allow reset if email isn't verified
        if (!user.isVerified) {

            return res.status(400).json({

                message: "Please verify your email first."

            });

        }

        // Generate Reset OTP
        const otp = generateOTP();

      user.resetOtp = otp;

user.resetOtpExpires = new Date(
    Date.now() + 10 * 60 * 1000
);

user.resetOtpVerified = false;

        await user.save();

        // Send Email
        await sendEmail(

            user.email,

            "Reset Your Org-Khana Password",

            `
                <h2>Forgot Password</h2>

                <p>Your password reset code is:</p>

                <h1>${otp}</h1>

                <p>This OTP will expire in <b>10 minutes</b>.</p>

                <p>If you didn't request a password reset, simply ignore this email.</p>
            `

        );

        return res.status(200).json({

            message: "Password reset OTP sent successfully.",

            email: user.email

        });

    } catch (error) {

        console.log("Forgot Password Error:", error);

        return res.status(500).json({

            message: "Internal Server Error."

        });

    }

};

const verifyResetOtpController = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                message: "User not found."
            });

        }

        if (user.resetOtp !== otp) {

            return res.status(400).json({
                message: "Invalid OTP."
            });

        }

        if (!user.resetOtpExpires || user.resetOtpExpires < new Date()) {

            return res.status(400).json({
                message: "OTP has expired."
            });

        }

        // ✅ OTP is valid
        user.resetOtpVerified = true;

        await user.save();

        return res.status(200).json({

            message: "OTP verified successfully."

        });

    } catch (error) {

        console.log("Verify Reset OTP Error:", error);

        return res.status(500).json({

            message: "Internal Server Error."

        });

    }

};
// ====================================
// Verify OTP Controller
// ====================================

const verifyOtpController = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                message: "User not found."
            });

        }

        if (user.isVerified) {

            return res.status(400).json({
                message: "Account already verified."
            });

        }

        if (user.otp !== otp) {

            return res.status(400).json({
                message: "Invalid OTP."
            });

        }

        if (user.otpExpires < new Date()) {

            return res.status(400).json({
                message: "OTP has expired."
            });

        }

        user.isVerified = true;

        user.otp = undefined;

        user.otpExpires = undefined;

        await user.save();

        return res.status(200).json({

            message: "Email verified successfully.",

            token: user.generateUserToken(),

            user: {

                _id: user._id,

                username: user.username,

                email: user.email,

                role: user.role

            }

        });

    } catch (error) {

        console.log("Verify OTP Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

// ====================================
// Reset Password Controller
// ====================================

const resetPasswordController = async (req, res) => {

    try {

        const {

            email,

            newPassword,

            confirmPassword

        } = req.body;

        // ==========================
        // Check User
        // ==========================

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        // ==========================
        // OTP Verified?
        // ==========================

        if (!user.resetOtpVerified) {

            return res.status(400).json({

                message: "Please verify your OTP first."

            });

        }

        // ==========================
        // OTP Expired?
        // ==========================

        if (

            !user.resetOtpExpires ||

            user.resetOtpExpires < new Date()

        ) {

            return res.status(400).json({

                message: "OTP has expired."

            });

        }

        // ==========================
        // Password Match
        // ==========================

        if (newPassword !== confirmPassword) {

            return res.status(400).json({

                message: "Passwords do not match."

            });

        }

        // ==========================
        // Password Length
        // ==========================

        if (newPassword.length < 5) {

            return res.status(400).json({

                message: "Password must be at least 5 characters."

            });

        }

        // ==========================
        // Prevent Same Password
        // ==========================

        const isSamePassword = await user.passwordVerify(newPassword);

        if (isSamePassword) {

            return res.status(400).json({

                message: "New password cannot be the same as your old password."

            });

        }

        // ==========================
        // Update Password
        // ==========================

        user.password = newPassword;

        // Clear reset information

        user.resetOtp = undefined;

        user.resetOtpExpires = undefined;

        user.resetOtpVerified = false;

        await user.save();

        return res.status(200).json({

            message: "Password reset successfully."

        });

    } catch (error) {

        console.log("Reset Password Error:", error);

        return res.status(500).json({

            message: "Internal Server Error."

        });

    }

};

// ====================================
// Resend OTP Controller
// ====================================

const resendOtpController = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                message: "User not found."
            });

        }

        if (user.isVerified) {

            return res.status(400).json({
                message: "Account is already verified."
            });

        }

        const otp = generateOTP();

        user.otp = otp;

        user.otpExpires = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await user.save();

        await sendEmail(

            user.email,

            "New Verification OTP",

            `
                <h2>Org-Khana 🌱</h2>

                <p>Your new verification code is:</p>

                <h1>${otp}</h1>

                <p>This OTP is valid for 10 minutes.</p>
            `

        );

        return res.status(200).json({

            message: "A new OTP has been sent to your email."

        });

    } catch (error) {

        console.log("Resend OTP Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

//Authenticate users data controller
const userDataController=async(req,res)=>{
    try{
        const userData=req.user;
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

module.exports={registerController,loginController,userDataController,getAllUsersController,updateUserRoleController,deleteUserController,verifyOtpController,resendOtpController,forgotPasswordController,verifyResetOtpController,resetPasswordController};