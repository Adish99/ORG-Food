const Coupon = require("../models/Coupon");
const Order = require("../models/Order");
const User = require("../models/User");


// ====================================
// Check & Generate Coupons
// ====================================

const checkAndGenerateCoupons = async (userId) => {

    try {

        // ====================================
        // Get User
        // ====================================

        const user = await User.findById(userId);

        if (!user) {
            console.log("User not found.");
            return;
        }


        // ====================================
        // 1. EVERY 5 DELIVERED PURCHASES
        // ====================================

        const purchaseMilestone =
            Math.floor(
                user.deliveredPurchaseCount / 5
            ) * 5;


        if (
            purchaseMilestone >= 5 &&
            purchaseMilestone > user.lastCouponMilestone
        ) {

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

                    purchaseMilestone,

                    minPurchaseAmount: 0

                });

                console.log(
                    `Loyalty coupon generated for ${purchaseMilestone} purchases.`
                );

            }


            // Remember the rewarded milestone
            user.lastCouponMilestone =
                purchaseMilestone;

            await user.save();

        }


        // ====================================
        // 2. MONTHLY SPENDING VIP COUPON
        // ====================================

        const monthlySpending =
            user.monthlySpending || 0;

        const couponMonth =
            user.monthlySpendingMonth;


        console.log("===== VIP COUPON DEBUG =====");
        console.log("User ID:", userId);
        console.log(
            "Monthly Spending:",
            monthlySpending
        );
        console.log(
            "Monthly Spending Month:",
            couponMonth
        );


        // ====================================
        // Check VIP Eligibility
        // ====================================

        if (
            monthlySpending >= 2500 &&
            couponMonth
        ) {

            console.log(
                "VIP eligibility: PASSED"
            );


            // Check whether this month's
            // VIP coupon already exists

            const existingMonthlyCoupon =
                await Coupon.findOne({

                    userId,

                    couponType:
                        "monthly-spending",

                    couponMonth

                });


            if (existingMonthlyCoupon) {

                console.log(
                    `VIP coupon already exists for ${couponMonth}.`
                );

            } else {

                // ====================================
                // Generate VIP Coupon
                // ====================================

                const vipCoupon =
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

                        couponType:
                            "monthly-spending",

                        couponMonth,

                        minPurchaseAmount: 2500

                    });


                console.log(
                    "VIP coupon generated successfully:",
                    vipCoupon.code
                );

            }

        } else {

            console.log(
                "VIP eligibility: FAILED"
            );

            console.log(
                "Required: Rs. 2500"
            );

            console.log(
                "Current spending:",
                monthlySpending
            );

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

            expiryDate: {
                $gt: new Date()
            }

        }).sort({

            createdAt: -1

        });


        return res.status(200).json({

            message:
                "Coupons fetched successfully.",

            coupons

        });

    } catch (error) {

        console.log(
            "Get User Coupons Error:",
            error
        );

        return res.status(500).json({

            message:
                "Something went wrong."

        });

    }

};


// ====================================
// Validate Coupon
// ====================================

const validateCouponController = async (req, res) => {

    try {

        const userId = req.user._id;

        const {
            code,
            totalAmount
        } = req.body;


        // ====================================
        // Basic Validation
        // ====================================

        if (!code) {

            return res.status(400).json({

                message:
                    "Coupon code is required."

            });

        }


        if (
            !totalAmount ||
            totalAmount <= 0
        ) {

            return res.status(400).json({

                message:
                    "Invalid order amount."

            });

        }


        // ====================================
        // Find Coupon
        // ====================================

        const coupon =
            await Coupon.findOne({

                code:
                    code.toUpperCase().trim(),

                userId,

                isUsed: false

            });


        if (!coupon) {

            return res.status(404).json({

                message:
                    "Invalid or unavailable coupon."

            });

        }


        // ====================================
        // Check Expiry
        // ====================================

        if (
            coupon.expiryDate <= new Date()
        ) {

            return res.status(400).json({

                message:
                    "This coupon has expired."

            });

        }


        // ====================================
        // Check Minimum Purchase
        // ====================================

        if (
            totalAmount <
            coupon.minPurchaseAmount
        ) {

            return res.status(400).json({

                message:
                    `Minimum purchase amount is Rs. ${coupon.minPurchaseAmount}.`

            });

        }


        // ====================================
        // Calculate Discount
        // ====================================

        let discountAmount = 0;


        if (
            coupon.discountType ===
            "percentage"
        ) {

            discountAmount =
                (
                    totalAmount *
                    coupon.discountValue
                ) / 100;

        }


        // Prevent negative total
        discountAmount =
            Math.min(
                discountAmount,
                totalAmount
            );


        const finalAmount =
            totalAmount -
            discountAmount;


        // ====================================
        // Return Result
        // ====================================

        return res.status(200).json({

            message:
                "Coupon applied successfully.",

            coupon: {

                id: coupon._id,

                code: coupon.code,

                couponType:
                    coupon.couponType,

                discountType:
                    coupon.discountType,

                discountValue:
                    coupon.discountValue,

                minPurchaseAmount:
                    coupon.minPurchaseAmount

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

            message:
                "Something went wrong."

        });

    }

};


// ====================================
// Exports
// ====================================

module.exports = {

    checkAndGenerateCoupons,

    getUserCouponsController,

    validateCouponController

};