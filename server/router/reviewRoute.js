const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addReviewController,
  getProductReviewsController,
  updateReviewController,
  deleteReviewController
} = require("../controllers/reviewController");


router.route("/add")
  .post(authMiddleware, addReviewController);

  router.route("/product/:productId")
  .get(getProductReviewsController);

  router.route("/:reviewId")
  .put(authMiddleware, updateReviewController)
  .delete(authMiddleware, deleteReviewController);

module.exports = router;