const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// Get all products with search, category, pagination and sorting
const getAllProductController = async (req, res) => {
  try {
    const {
      search,
      category,
      page = 1,
      limit = 5,
      sort,
    } = req.query;

    console.log("Category received:", category);

    // Filter object
    let filter = {};

    // Search by product name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by categoryId
    if (category) {
      filter.categoryId = category;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Sorting
    let sortOptions = {};

    if (sort === "price") {
      sortOptions = { price: 1 };
    } else if (sort === "-price") {
      sortOptions = { price: -1 };
    }

    // Get products
    const products = await Product.find(filter)
      .populate("categoryId", "categoryName")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Total products count
    const totalProducts = await Product.countDocuments(filter);

    return res.status(200).json({
      message: "Products fetched successfully",
      currentPage: Number(page),
      totalProducts,
      totalPages: Math.ceil(totalProducts / Number(limit)),
      products,
    });

  } catch (error) {

    console.log("getAllProducts error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });

  }
};

// Get Specific Product
const getSpecificProdController = async (req, res) => {

  try {

    const id = req.params.id;

    const data = await Product.findOne({ _id: id });

    return res.status(200).json({ data });

  } catch (error) {

    console.log("getSpecificProduct error:", error);

    return res.status(404).json({
      message: "No product found!"
    });

  }

};

//Add Products from admin

const addProductController = async (req, res) => {
    try {

        const {
            name,
            description,
            price,
            stock,
            weight,
            categoryId,
            isFeatured
        } = req.body;

        // Check required fields
        if (
            !name ||
            !description ||
            !price ||
            !stock ||
            !weight ||
            !categoryId
        ) {

            return res.status(400).json({
                message: "Please fill all required fields."
            });

        }

        let imageUrl = "";
        if (req.file) {

    const uploadResult = await new Promise((resolve, reject) => {

        cloudinary.uploader.upload_stream(

            {

                folder: "Org-Khana/Products"

            },

            (error, result) => {

                if (error) return reject(error);

                resolve(result);

            }

        ).end(req.file.buffer);

    });

    imageUrl = uploadResult.secure_url;

}


        // Create product
        const product = await Product.create({

            name,
            description,
            price,
            stock,
            weight,
            image:imageUrl,
            categoryId,
            isFeatured

        });

        return res.status(201).json({

            message: "Product added successfully.",
            product

        });

    } catch (error) {

        console.log("Add Product Controller Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

// Update Product
const updateProductController = async (req, res) => {

  try {

    const id = req.params.id;

    const {
      name,
      description,
      price,
      stock,
      weight,
      image,
      categoryId,
      isFeatured
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {

      return res.status(404).json({
        message: "Product not found!"
      });

    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.weight = weight;
    product.image = image;
    product.categoryId = categoryId;
    product.isFeatured = isFeatured;

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully.",
      product
    });

  } catch (error) {

    console.log("Update Product Controller Error:", error);

    return res.status(500).json({
      message: "Internal Server Error"
    });

  }

};

//Delete Products by Admin

const deleteProductController = async (req, res) => {

    try {

        const id = req.params.id;

        const product = await Product.findById(id);

        if (!product) {

            return res.status(404).json({
                message: "Product not found!"
            });

        }

        await Product.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Product deleted successfully."
        });

    } catch (error) {

        console.log("Delete Product Controller Error:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

// Filtering category wise products
const getCategoryProductController = async (req, res) => {

  try {

    const id = req.params.categoryId;

    const productResult = await Product.find({
      categoryId: id
    });

    return res.status(200).json({
      message: "Product found.",
      productResult
    });

  } catch (error) {

    console.log("FilteringCategoryControllers error:", error);

    return res.status(500).json({
      message: "Internal server error!"
    });

  }

};

module.exports = {
  getAllProductController,
  getSpecificProdController,
  addProductController,
  updateProductController,
  getCategoryProductController,
  deleteProductController
};