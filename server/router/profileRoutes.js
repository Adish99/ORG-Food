const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    uploadProfileImageController,
    removeProfileImageController
} = require("../controllers/profileController");

const upload = require("../middleware/uploadMiddleware");


// ====================================
// Upload / Update Profile Picture
// ====================================

router.put(
    "/profile-image",
    authMiddleware,
    upload.single("profileImage"),
    uploadProfileImageController
);


// ====================================
// Remove Profile Picture
// ====================================

router.delete(
    "/profile-image",
    authMiddleware,
    removeProfileImageController
);


module.exports = router;