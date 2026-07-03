const express=require("express");
const { getAllCategoriesController } = require("../controllers/categoryController");
const router=express.Router();

//Routes
router.get("/", getAllCategoriesController);

module.exports=router;