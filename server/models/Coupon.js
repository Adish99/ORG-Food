const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

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

        expiryDate: {
            type: Date,
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        isUsed: {
            type: Boolean,
            default: false
        },

        couponType: {
            type: String,
            enum: ["loyalty", "monthly-spending"],
            required: true
        },
        minPurchaseAmount: {
    type: Number,
    default: 0
}
    },
    {
        timestamps: true
    }
);

const Coupon =
    mongoose.models.Coupon ||
    mongoose.model("Coupon", couponSchema);

module.exports = Coupon;