const express=require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {getAllProductController,getSpecificProdController, getCategoryProductController}= require("../controllers/productController");

const router=express.Router();

//Routes
router.route("/getallprod").get(authMiddleware,getAllProductController);
router.route("/getprod/:id").get(authMiddleware,getSpecificProdController);
router.route("/category/:categoryId").get(authMiddleware,getCategoryProductController);

module.exports=router;