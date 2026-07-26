const express=require("express");
const { getAllCategoriesController, addCategoryController, updateCategoryController, deleteCategoryController } = require("../controllers/categoryController");
const adminMiddleware = require("../middleware/adminMiddleware");
const router=express.Router();

//Routes
router.get("/", getAllCategoriesController);
router.route("/add").post(adminMiddleware,addCategoryController);
router.route("/update/:id").put(adminMiddleware,updateCategoryController);
router.route("/delete/:id").delete(adminMiddleware,deleteCategoryController);

module.exports=router;