const express=require("express");
const { getAllCategoriesController, addCategoryController, updateCategoryController, deleteCategoryController } = require("../controllers/categoryController");
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const router=express.Router();

//Routes
router.get("/",getAllCategoriesController);
router.route("/add").post(authMiddleware,adminMiddleware,addCategoryController);
router.route("/update/:id").put(authMiddleware,adminMiddleware,updateCategoryController);
router.route("/delete/:id").delete(authMiddleware,adminMiddleware,deleteCategoryController);

module.exports=router;