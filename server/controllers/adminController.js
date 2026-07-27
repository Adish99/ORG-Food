const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");

const getDashboardStatsController = async (req, res) => {
     console.log("Dashboard controller hit");
    try {

        const totalUsers = await User.countDocuments();

const totalProducts = await Product.countDocuments();

const totalCategories = await Category.countDocuments();

const totalOrders = await Order.countDocuments();


// Get all delivered orders
const deliveredOrders = await Order.find({
    orderStatus: "Delivered"
});

// Calculate total revenue

        const totalRevenue = deliveredOrders.reduce(

            (sum, order) => sum + order.totalAmount,

            0

        );

        // Latest 5 Orders
const recentOrders = await Order.find()

    .populate("userId", "username")

    .sort({ createdAt: -1 })

    .limit(5);

// Latest 5 Users
const recentUsers = await User.find()

    .select("username email createdAt")

    .sort({ createdAt: -1 })

    .limit(5);

        return res.status(200).json({

            totalUsers,

            totalProducts,

            totalCategories,

            totalOrders,

            totalRevenue,
            recentOrders,
            recentUsers

        });

    } catch (error) {

        console.log("Dashboard Stats Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

module.exports={getDashboardStatsController};