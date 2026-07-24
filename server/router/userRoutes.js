const express=require("express");
const {registerController,loginController, userDataController, getAllUsersController, updateUserRoleController, deleteUserController} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

//Router creation
const router=new express.Router();

//User routes
router.route("/register").post(registerController);
router.route("/login").post(loginController);
router.route("/users").get(authMiddleware,userDataController);
router.route("/admin/users").get(getAllUsersController);
router.route("/admin/users/:id").put(updateUserRoleController);
router.route("/admin/users/:id").delete(authMiddleware,deleteUserController);

module.exports=router;