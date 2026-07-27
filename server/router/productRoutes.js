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
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.route("/getallprod").get(getAllProductController);
router.route("/getprod/:id").get(getSpecificProdController);
router.route("/category/:categoryId").get(getCategoryProductController);
router.route("/add").post(authMiddleware,adminMiddleware,addProductController);
router.route("/update/:id").put(authMiddleware,adminMiddleware,updateProductController);
router.route("/delete/:id").delete(authMiddleware,adminMiddleware,deleteProductController);

module.exports = router;