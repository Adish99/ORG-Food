const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addReviewController,
  getProductReviewsController,
  updateReviewController,
  deleteReviewController,
  deleteReviewAdminController,
  getAllReviewsAdminController
} = require("../controllers/reviewController");
const adminMiddleware = require("../middleware/adminMiddleware");


router.route("/add")
  .post(authMiddleware, addReviewController);

  router.route("/product/:productId")
  .get(getProductReviewsController);

  router.route("/:reviewId")
  .put(authMiddleware, updateReviewController)
  .delete(authMiddleware, deleteReviewController);

  // ==========================
// Admin Review Routes
// ==========================

router.route("/admin/all")
    .get(
        authMiddleware,
        adminMiddleware,
        getAllReviewsAdminController
    );


router.route("/admin/:reviewId")
    .delete(
        authMiddleware,
        adminMiddleware,
        deleteReviewAdminController
    );

module.exports = router;