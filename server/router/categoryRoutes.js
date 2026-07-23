const express=require("express");
const { getAllCategoriesController, addCategoryController, updateCategoryController, deleteCategoryController } = require("../controllers/categoryController");
const router=express.Router();

//Routes
router.get("/", getAllCategoriesController);
router.route("/add").post(addCategoryController);
router.route("/update/:id").put(updateCategoryController);
router.route("/delete/:id").delete(deleteCategoryController);

module.exports=router;