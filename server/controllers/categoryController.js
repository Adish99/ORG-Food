const Category = require("../models/Category");

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

module.exports = { getAllCategoriesController };