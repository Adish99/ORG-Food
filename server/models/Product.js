const mongoose = require("mongoose");

// Schema creation for product
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    weight: {
      type: String,
      required: true,
      trim: true
      // Example: "1kg", "500g", "1L"
    },

    image: {
      type: String,
      required: true,
      trim: true
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Model creation
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;