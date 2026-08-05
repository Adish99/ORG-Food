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


// Get all delivered orders
const deliveredOrders = await Order.find({
    orderStatus: "Delivered"
});

// Calculate total revenue

        const totalRevenue = deliveredOrders.reduce(

            (sum, order) => sum + order.totalAmount,

            0

        );
        // Monthly Revenue
const monthlyRevenue = await Order.aggregate([

    {
        $match: {
            orderStatus: "Delivered"
        }
    },

    {
        $group: {

            _id: {

                year: { $year: "$createdAt" },

                month: { $month: "$createdAt" }

            },

            revenue: {

                $sum: "$totalAmount"

            }

        }
    },

    {
        $sort: {

            "_id.year": 1,

            "_id.month": 1

        }
    }

]);
const monthNames = [

    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"

];

const formattedMonthlyRevenue = monthlyRevenue.map((item) => ({

    month: monthNames[item._id.month - 1],

    revenue: item.revenue

}));
const formattedMonthlyOrders = monthlyOrders.map((item) => ({

    month: monthNames[item._id.month - 1],

    orders: item.orders

}));

const formattedOrderStatus = orderStatusData.map((item) => ({

    status: item._id,

    count: item.count

}));

const formattedTopProducts = topSellingProducts.map((item) => ({

    product: item.productName,

    sold: item.totalSold

}));

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

    recentUsers,

    monthlyRevenue: formattedMonthlyRevenue,

    monthlyOrders: formattedMonthlyOrders,

    orderStatusData: formattedOrderStatus,

    topSellingProducts: formattedTopProducts

});

// Monthly Orders
const monthlyOrders = await Order.aggregate([

    {
        $group: {

            _id: {

                year: { $year: "$createdAt" },

                month: { $month: "$createdAt" }

            },

            orders: {

                $sum: 1

            }

        }
    },

    {
        $sort: {

            "_id.year": 1,

            "_id.month": 1

        }
    }

]);

// Order Status Distribution
const orderStatusData = await Order.aggregate([

    {
        $group: {

            _id: "$orderStatus",

            count: {
                $sum: 1
            }

        }

    },

    {
        $sort: {
            _id: 1
        }
    }

]);

// Top Selling Products
const topSellingProducts = await Order.aggregate([

    {
        $unwind: "$products"
    },

    {
        $group: {

            _id: "$products.productId",

            productName: {
                $first: "$products.name"
            },

            totalSold: {
                $sum: "$products.quantity"
            }

        }

    },

    {
        $sort: {
            totalSold: -1
        }
    },

    {
        $limit: 5
    }

]);

    } catch (error) {

        console.log("Dashboard Stats Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

module.exports={getDashboardStatsController};