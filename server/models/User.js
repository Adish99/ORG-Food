const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ====================================
// User Schema
// ====================================

const userSchema = new mongoose.Schema(
    {

        // ====================================
        // Basic User Information
        // ====================================

        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,

            validate(val) {
                if (!validator.isEmail(val)) {
                    throw new Error("Invalid Email Format");
                }
            }
        },

        password: {
            type: String,
            required: true,
            minlength: 5
        },

        phone: {
            type: String,
            required: true,
            minlength: [
                10,
                "Minimum 10 digits required!"
            ],
            maxlength: [
                10,
                "Maximum 10 Digits required!"
            ]
        },

        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        },

        address: {
            type: String,
            required: true
        },


        // ====================================
        // Coupon / Loyalty Progress
        // ====================================

        // Number of successfully delivered orders
        //
        // IMPORTANT:
        // This is stored in User, not calculated
        // from Order documents.
        //
        // Therefore, deleting an old order will
        // NOT reduce this number.

        deliveredPurchaseCount: {
            type: Number,
            default: 0,
            min: 0
        },


        // Last purchase milestone for which
        // a loyalty coupon was generated.
        //
        // Example:
        // 5  -> coupon generated
        // 10 -> next coupon generated
        // 15 -> next coupon generated

        lastCouponMilestone: {
            type: Number,
            default: 0,
            min: 0
        },


        // ====================================
        // Monthly Spending Progress
        // ====================================

        // Total amount spent through delivered
        // orders during the current month.

        monthlySpending: {
            type: Number,
            default: 0,
            min: 0
        },


        // Stores which month the monthlySpending
        // belongs to.
        //
        // Example:
        // "2026-08"

        monthlySpendingMonth: {
            type: String,
            default: ""
        },


        // ====================================
        // Special Coupon Progress
        // ====================================

        // Number of coupons successfully used/
        // redeemed by the user.

        usedCouponCount: {
            type: Number,
            default: 0,
            min: 0
        },


        // Last used-coupon milestone for which
        // a special coupon was generated.
        //
        // Example:
        // 5  -> special coupon
        // 10 -> special coupon
        // 15 -> special coupon

        lastSpecialCouponMilestone: {
            type: Number,
            default: 0,
            min: 0
        },


        // ====================================
        // Profile Information
        // ====================================

        profileImage: {
            type: String,
            default: ""
        },

        profileImagePublicId: {
            type: String,
            default: ""
        },


        // ====================================
        // Account Verification OTP
        // ====================================

        otp: {
            type: String,
            default: null
        },

        otpExpires: {
            type: Date,
            default: null
        },


        // ====================================
        // Password Reset OTP
        // ====================================

        resetOtp: {
            type: String
        },

        resetOtpExpires: {
            type: Date
        },

        resetOtpVerified: {
            type: Boolean,
            default: false
        },


        // ====================================
        // Email / Account Verification
        // ====================================

        isVerified: {
            type: Boolean,
            default: false
        }

    },

    {
        timestamps: true
    }
);


// ====================================
// Password Hashing
// ====================================

userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }

    try {

        const salt_round = await bcrypt.genSalt(10);

        const hashedPassword =
            await bcrypt.hash(
                this.password,
                salt_round
            );

        this.password = hashedPassword;

    } catch (error) {

        console.log(
            "Password Hashing Error:",
            error
        );

    }

});


// ====================================
// Password Verification
// ====================================

userSchema.methods.passwordVerify = function (password) {

    return bcrypt.compare(
        password,
        this.password
    );

};


// ====================================
// Generate JWT Token
// ====================================

userSchema.methods.generateUserToken = function () {

    try {

        return jwt.sign(

            {
                userId: this._id.toString(),
                email: this.email,
                role: this.role
            },

            process.env.SECRET_KEY,

            {
                expiresIn: "30d"
            }

        );

    } catch (error) {

        console.log(
            "Token Generation Error:",
            error
        );

    }

};


// ====================================
// Model Creation
// ====================================

const User =
    mongoose.models.User ||
    mongoose.model("User", userSchema);


module.exports = User;