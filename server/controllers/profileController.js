const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// ====================================
// Upload / Update Profile Picture
// ====================================

const uploadProfileImageController = async (req, res) => {

    try {

        // Get logged-in user's ID
        const userId = req.user._id;

        // Find user
        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                message: "User not found."
            });

        }

        // Check whether image was uploaded
        if (!req.file) {

            return res.status(400).json({
                message: "Please select a profile picture."
            });

        }

        // ====================================
        // Delete Old Profile Image
        // ====================================

        if (user.profileImagePublicId) {

            await cloudinary.uploader.destroy(
                user.profileImagePublicId
            );

        }

        // ====================================
        // Upload New Image to Cloudinary
        // ====================================

        const uploadResult = await new Promise(
            (resolve, reject) => {

                cloudinary.uploader.upload_stream(

                    {
                        folder: "Org-Khana/Profiles"
                    },

                    (error, result) => {

                        if (error) {
                            return reject(error);
                        }

                        resolve(result);
                    }

                ).end(req.file.buffer);

            }
        );

        // ====================================
        // Save Image Information
        // ====================================

        user.profileImage = uploadResult.secure_url;

        user.profileImagePublicId =
            uploadResult.public_id;

        await user.save();

        // ====================================
        // Response
        // ====================================

        return res.status(200).json({

            message: "Profile picture updated successfully.",

            profileImage: user.profileImage

        });

    } catch (error) {

        console.log(
            "Upload Profile Image Controller Error:",
            error
        );

        return res.status(500).json({

            message: "Internal Server Error."

        });

    }

};


// ====================================
// Remove Profile Picture
// ====================================

const removeProfileImageController = async (req, res) => {

    try {

        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({

                message: "User not found."

            });

        }

        // Delete image from Cloudinary
        if (user.profileImagePublicId) {

            await cloudinary.uploader.destroy(

                user.profileImagePublicId

            );

        }

        // Remove image information from MongoDB
        user.profileImage = "";

        user.profileImagePublicId = "";

        await user.save();

        return res.status(200).json({

            message: "Profile picture removed successfully."

        });

    } catch (error) {

        console.log(
            "Remove Profile Image Controller Error:",
            error
        );

        return res.status(500).json({

            message: "Internal Server Error."

        });

    }

};


module.exports = {

    uploadProfileImageController,

    removeProfileImageController

};