const express = require("express");
const {
  getAllProductController,
  getSpecificProdController,
  getCategoryProductController,
  updateProductController,
  deleteProductController,
  addProductController,
} = require("../controllers/productController");

const router = express.Router();

// Public Routes
router.route("/getallprod").get(getAllProductController);
router.route("/getprod/:id").get(getSpecificProdController);
router.route("/category/:categoryId").get(getCategoryProductController);
router.route("/add").post(addProductController);
router.route("/update/:id").put(updateProductController);
router.route("/delete/:id").delete(deleteProductController);

module.exports = router;