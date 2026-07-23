const Category = require("../models/Category");
const Product = require("../models/Product");

// ===============================
// Add Category
// ===============================

const addCategoryController = async (req, res) => {

    try {

        const { categoryName } = req.body;

        // Validation

        if (!categoryName) {

            return res.status(400).json({
                message: "Category name is required."
            });

        }

        // Check if category already exists
        const formattedCategoryName = categoryName.trim();

       const existingCategory = await Category.findOne({
    categoryName: {
        $regex: `^${formattedCategoryName}$`,
        $options: "i"
    }
});

        if (existingCategory) {

            return res.status(400).json({
                message: "Category already exists."
            });

        }

        // Create category

        const category = await Category.create({
            categoryName:formattedCategoryName
        });

        return res.status(201).json({

            message: "Category added successfully.",

            category

        });

    } catch (error) {

        console.log("addCategoryController Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

const getAllCategoriesController = async (req, res) => {
    try {

        const categories = await Category.find();

        return res.status(200).json({
            message: "Categories fetched successfully",
            categories
        });

    } catch (error) {

        console.log("Get categories error:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }
};

// ===============================
// Update Category
// ===============================

const updateCategoryController = async (req, res) => {

    try {

        const { id } = req.params;

        const categoryName = req.body.categoryName.trim();

        if (!categoryName) {

            return res.status(400).json({
                message: "Category name is required."
            });

        }

        const category = await Category.findByIdAndUpdate(
            id,
            {
                categoryName
            },
            {
                new: true
            }
        );

        if (!category) {

            return res.status(404).json({
                message: "Category not found."
            });

        }

        return res.status(200).json({

            message: "Category updated successfully.",

            category

        });

    } catch (error) {

        console.log("Update Category Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

// ===============================
// Delete Category
// ===============================

const deleteCategoryController = async (req, res) => {

    try {

        const { id } = req.params;

        // Check whether any products use this category
        const productExists = await Product.findOne({
            categoryId: id
        });

        if (productExists) {

            return res.status(400).json({
                message: "Cannot delete category. Products are assigned to this category."
            });

        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {

            return res.status(404).json({
                message: "Category not found."
            });

        }

        return res.status(200).json({
            message: "Category deleted successfully."
        });

    } catch (error) {

        console.log("Delete Category Error:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

module.exports = { getAllCategoriesController,addCategoryController,updateCategoryController,deleteCategoryController };