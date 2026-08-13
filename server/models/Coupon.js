const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        // ====================================
        // Coupon Code
        // ====================================

        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        // ====================================
        // Discount
        // ====================================

        discountType: {
            type: String,
            enum: ["percentage"],
            default: "percentage"
        },

        discountValue: {
            type: Number,
            required: true,
            min: 1,
            max: 100
        },

        // ====================================
        // Expiry
        // ====================================

        expiryDate: {
            type: Date,
            required: true
        },

        // ====================================
        // Coupon Owner
        // ====================================

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // ====================================
        // Coupon Usage
        // ====================================

        isUsed: {
            type: Boolean,
            default: false
        },

        // ====================================
        // Coupon Type
        // ====================================

        couponType: {
            type: String,
            enum: [
                "loyalty",
                "monthly-spending",
                "special"
            ],
            required: true
        },

        // ====================================
        // Loyalty Purchase Milestone
        // Example: 5, 10, 15, 20...
        // ====================================

        purchaseMilestone: {
            type: Number,
            default: 0
        },

        // ====================================
        // Monthly Spending Coupon
        // Example: "2026-08"
        // ====================================

        couponMonth: {
            type: String,
            default: ""
        },

        // ====================================
        // Minimum Purchase Amount
        // ====================================

        minPurchaseAmount: {
            type: Number,
            default: 0
        }
    },

    {
        timestamps: true
    }
);


// ====================================
// Model Creation
// ====================================

const Coupon =
    mongoose.models.Coupon ||
    mongoose.model("Coupon", couponSchema);


module.exports = Coupon;