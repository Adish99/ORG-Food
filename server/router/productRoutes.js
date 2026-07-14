const express = require("express");
const {
  getAllProductController,
  getSpecificProdController,
  getCategoryProductController,
} = require("../controllers/productController");

const router = express.Router();

// Public Routes
router.route("/getallprod").get(getAllProductController);
router.route("/getprod/:id").get(getSpecificProdController);
router.route("/category/:categoryId").get(getCategoryProductController);

module.exports = router;