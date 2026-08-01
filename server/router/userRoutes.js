const express=require("express");
const {registerController,loginController, userDataController, getAllUsersController, updateUserRoleController, deleteUserController, verifyOtpController, resendOtpController, forgotPasswordController, verifyResetOtpController, resetPasswordController, getProfileController, updateProfileController, changePasswordController} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

//Router creation
const router=new express.Router();

//User routes
router.route("/register").post(registerController);
router.route("/login").post(loginController);
router.post("/verify-otp", verifyOtpController);
router.post("/resend-otp", resendOtpController);
router.route("/forgot-password").post(forgotPasswordController);
router.route("/verify-reset-otp").post(verifyResetOtpController);
router.route("/reset-password").post(resetPasswordController);
router.route("/users").get(authMiddleware,userDataController);
router.route("/profile").get(authMiddleware,getProfileController);
router.route("/profile").put(authMiddleware,updateProfileController);
router.route("/change-password").put(authMiddleware,changePasswordController);
router.route("/admin/users").get(authMiddleware,adminMiddleware,getAllUsersController);
router.route("/admin/users/:id").put(authMiddleware,adminMiddleware,updateUserRoleController);
router.route("/admin/users/:id").delete(authMiddleware,adminMiddleware,deleteUserController);

module.exports=router;