const express=require("express");
const {addToCartController,getUserCartController, updateCartQuantityController, removeCartProductController} = require("../controllers/cartController");
const authMiddleware=require("../middleware/authMiddleware");
const router=new express.Router();

//Routes
router.route("/add").post(authMiddleware,addToCartController);
router.route("/").get(authMiddleware,getUserCartController);
router.route("/update").put(authMiddleware,updateCartQuantityController);
router.route("/remove").delete(authMiddleware,removeCartProductController);

module.exports=router;