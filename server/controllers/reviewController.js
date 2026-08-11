const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Add Review
const addReviewController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, rating, comment } = req.body;

    // 1. Check required fields
    if (!productId || !rating || !comment) {
      return res.status(400).json({
        message: "Product, rating and comment are required."
      });
    }

    // 2. Check whether product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found."
      });
    }

    // 3. Check whether rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5."
      });
    }

    // 4. Check whether user has already reviewed this product
    const existingReview = await Review.findOne({
      userId,
      productId
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this product."
      });
    }

    // 5. Check whether user has purchased the product
    const purchasedProduct = await Order.findOne({
      userId,
      orderStatus: "Delivered",
      "products.productId": productId
    });

    if (!purchasedProduct) {
      return res.status(403).json({
        message: "You can review only products you have purchased and received."
      });
    }

    // 6. Create review
    const review = await Review.create({
      userId,
      productId,
      rating,
      comment
    });

    res.status(201).json({
      message: "Review added successfully.",
      review
    });

  } catch (error) {
    console.error("Add Review Error:", error);

    res.status(500).json({
      message: "Failed to add review."
    });
  }
};

// Get reviews for a product
const getProductReviewsController = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check whether product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found."
      });
    }

    // Get all reviews
    const reviews = await Review.find({ productId })
      .populate("userId", "username profileImage")
      .sort({ createdAt: -1 });

    // Calculate total reviews
    const totalReviews = reviews.length;

    // Calculate average rating
    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    const averageRating =
      totalReviews > 0
        ? (totalRating / totalReviews).toFixed(1)
        : 0;

    res.status(200).json({
      message: "Reviews fetched successfully.",
      totalReviews,
      averageRating: Number(averageRating),
      reviews
    });

  } catch (error) {
    console.error("Get Product Reviews Error:", error);

    res.status(500).json({
      message: "Failed to fetch reviews."
    });
  }
};

// Update Review
const updateReviewController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    // Check required fields
    if (!rating || !comment) {
      return res.status(400).json({
        message: "Rating and comment are required."
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5."
      });
    }

    // Find review belonging to this user
    const review = await Review.findOne({
      _id: reviewId,
      userId
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found or you are not authorized."
      });
    }

    // Update review
    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.status(200).json({
      message: "Review updated successfully.",
      review
    });

  } catch (error) {
    console.error("Update Review Error:", error);

    res.status(500).json({
      message: "Failed to update review."
    });
  }
};

// Delete Review
const deleteReviewController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { reviewId } = req.params;

    // Find review belonging to this user
    const review = await Review.findOne({
      _id: reviewId,
      userId
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found or you are not authorized."
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      message: "Review deleted successfully."
    });

  } catch (error) {
    console.error("Delete Review Error:", error);

    res.status(500).json({
      message: "Failed to delete review."
    });
  }
};

// ==========================
// Admin - Get All Reviews
// ==========================

const getAllReviewsAdminController = async (req, res) => {

    try {

        const reviews = await Review.find()

            .populate("userId", "username email")

            .populate("productId", "name image")

            .sort({ createdAt: -1 });


        return res.status(200).json({

            message: "Reviews fetched successfully.",

            reviews

        });

    } catch (error) {

        console.error(
            "Admin Get Reviews Error:",
            error
        );

        return res.status(500).json({

            message: "Failed to fetch reviews."

        });

    }

};


// ==========================
// Admin - Delete Review
// ==========================

const deleteReviewAdminController = async (req, res) => {

    try {

        const { reviewId } = req.params;


        const review = await Review.findById(reviewId);


        if (!review) {

            return res.status(404).json({

                message: "Review not found."

            });

        }


        await Review.findByIdAndDelete(reviewId);


        return res.status(200).json({

            message: "Review deleted successfully."

        });

    } catch (error) {

        console.error(
            "Admin Delete Review Error:",
            error
        );

        return res.status(500).json({

            message: "Failed to delete review."

        });

    }

};

module.exports = {
  addReviewController,
  getProductReviewsController,
  updateReviewController,
  deleteReviewController,
  getAllReviewsAdminController,
  deleteReviewAdminController
};