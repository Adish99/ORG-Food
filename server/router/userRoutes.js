const express=require("express");
const {registerController,loginController, userDataController} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

//Router creation
const router=new express.Router();

//User routes
router.route("/register").post(registerController);
router.route("/login").post(loginController);
router.route("/users").get(authMiddleware,userDataController);

module.exports=router;