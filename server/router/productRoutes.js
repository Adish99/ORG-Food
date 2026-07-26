const express = require("express");
const {
  getAllProductController,
  getSpecificProdController,
  getCategoryProductController,
  updateProductController,
  deleteProductController,
  addProductController,
} = require("../controllers/productController");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Public Routes
router.route("/getallprod").get(getAllProductController);
router.route("/getprod/:id").get(getSpecificProdController);
router.route("/category/:categoryId").get(getCategoryProductController);
router.route("/add").post(adminMiddleware,addProductController);
router.route("/update/:id").put(adminMiddleware,updateProductController);
router.route("/delete/:id").delete(adminMiddleware,deleteProductController);

module.exports = router;