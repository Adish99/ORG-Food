const Coupon = require("../models/Coupon");
const Order = require("../models/Order");

const checkAndGenerateCoupons = async (userId) => {

    try {

        // ====================================
        // Get all delivered orders
        // ====================================

        const deliveredOrders = await Order.find({
            userId,
            orderStatus: "Delivered"
        });


        // ====================================
        // 1. EVERY 5 PURCHASES
        // ====================================

        const purchaseMilestone =
            Math.floor(deliveredOrders.length / 5) * 5;


        if (purchaseMilestone >= 5) {

            const existingLoyaltyCoupon =
                await Coupon.findOne({

                    userId,

                    couponType: "loyalty",

                    purchaseMilestone

                });


            if (!existingLoyaltyCoupon) {

                await Coupon.create({

                    code:
                        `LOYAL10-${purchaseMilestone}-${Date.now()}`,

                    discountType: "percentage",

                    discountValue: 10,

                    expiryDate:
                        new Date(
                            Date.now() +
                            30 * 24 * 60 * 60 * 1000
                        ),

                    userId,

                    couponType: "loyalty",

                    purchaseMilestone

                });

                console.log(
                    `Loyalty coupon generated for ${purchaseMilestone} purchases.`
                );

            }

        }


        // ====================================
        // 2. MONTHLY SPENDING
        // ====================================

        const now = new Date();


        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );


        const startOfNextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );


        const monthlyOrders =
            deliveredOrders.filter((order) =>

                order.createdAt >= startOfMonth &&

                order.createdAt < startOfNextMonth

            );


        const monthlySpending =
            monthlyOrders.reduce(

                (total, order) =>

                    total + order.totalAmount,

                0

            );


        // Example: "2026-08"
        const couponMonth =
            `${now.getFullYear()}-${String(
                now.getMonth() + 1
            ).padStart(2, "0")}`;


        if (monthlySpending >= 2500) {

            const existingMonthlyCoupon =
                await Coupon.findOne({

                    userId,

                    couponType: "monthly-spending",

                    couponMonth

                });


            if (!existingMonthlyCoupon) {

                await Coupon.create({

                    code:
                        `VIP20-${couponMonth}-${Date.now()}`,

                    discountType: "percentage",

                    discountValue: 20,

                    expiryDate:
                        new Date(
                            Date.now() +
                            30 * 24 * 60 * 60 * 1000
                        ),

                    userId,

                    couponType: "monthly-spending",

                    couponMonth

                });

                console.log(
                    `Monthly coupon generated for ${couponMonth}.`
                );

            }

        }

    } catch (error) {

        console.log(
            "Coupon generation error:",
            error
        );

    }

};

// ====================================
// Get User Coupons
// ====================================

const getUserCouponsController = async (req, res) => {

    try {

        const userId = req.user._id;

        const coupons = await Coupon.find({
            userId,
            isUsed: false,
            expiryDate: { $gt: new Date() }
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({

            message: "Coupons fetched successfully.",

            coupons

        });

    } catch (error) {

        console.log(
            "Get User Coupons Error:",
            error
        );

        return res.status(500).json({

            message: "Something went wrong."

        });

    }

};

// ====================================
// Validate Coupon
// ====================================

const validateCouponController = async (req, res) => {

    try {

        const userId = req.user._id;

        const { code, totalAmount } = req.body;


        if (!code) {

            return res.status(400).json({

                message: "Coupon code is required."

            });

        }


        if (!totalAmount || totalAmount <= 0) {

            return res.status(400).json({

                message: "Invalid order amount."

            });

        }


        const coupon = await Coupon.findOne({

            code: code.toUpperCase().trim(),

            userId,

            isUsed: false

        });


        if (!coupon) {

            return res.status(404).json({

                message: "Invalid or unavailable coupon."

            });

        }


        // Check expiry

        if (coupon.expiryDate <= new Date()) {

            return res.status(400).json({

                message: "This coupon has expired."

            });

        }


        // Calculate discount

        let discountAmount = 0;


        if (coupon.discountType === "percentage") {

            discountAmount =
                (totalAmount * coupon.discountValue) / 100;

        }


        const finalAmount =
            totalAmount - discountAmount;


        return res.status(200).json({

            message: "Coupon applied successfully.",

            coupon: {

                code: coupon.code,

                discountType: coupon.discountType,

                discountValue: coupon.discountValue

            },

            discountAmount,

            finalAmount

        });

    } catch (error) {

        console.log(
            "Validate Coupon Error:",
            error
        );

        return res.status(500).json({

            message: "Something went wrong."

        });

    }

};



module.exports = {
    checkAndGenerateCoupons,
    getUserCouponsController,
    validateCouponController
};