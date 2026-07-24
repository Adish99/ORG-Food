const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");

const getDashboardStatsController = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalProducts = await Product.countDocuments();

        const totalCategories = await Category.countDocuments();

        const totalOrders = await Order.countDocuments();

        const deliveredOrders = await Order.find({
            orderStatus: "Delivered"
        });

        const totalRevenue = deliveredOrders.reduce(

            (sum, order) => sum + order.totalAmount,

            0

        );

        return res.status(200).json({

            totalUsers,

            totalProducts,

            totalCategories,

            totalOrders,

            totalRevenue

        });

    } catch (error) {

        console.log("Dashboard Stats Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

module.exports={getDashboardStatsController};