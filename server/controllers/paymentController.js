const axios = require("axios");
const crypto = require("crypto");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");

// ====================================
// Generate Signature
// ====================================

const generateSignature = (message, secret) => {

    return crypto
        .createHmac("sha256", secret)
        .update(message)
        .digest("base64");

};

// ====================================
// Verify eSewa Response Signature
// ====================================

const verifySignature = (decodedData) => {

    const message =
        `transaction_code=${decodedData.transaction_code},` +
        `status=${decodedData.status},` +
        `total_amount=${decodedData.total_amount},` +
        `transaction_uuid=${decodedData.transaction_uuid},` +
        `product_code=${decodedData.product_code},` +
        `signed_field_names=${decodedData.signed_field_names}`;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
        .update(message)
        .digest("base64");

    return expectedSignature === decodedData.signature;

};


// ====================================
// Initiate eSewa Payment
// ====================================

const initiateEsewaPaymentController = async (req, res) => {

    try {

        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {

            return res.status(404).json({
                message: "Order not found."
            });

        }

        if (order.paymentStatus === "Paid") {

            return res.status(400).json({
                message: "Order already paid."
            });

        }

        // Generate unique transaction UUID for every payment attempt
        const transactionUUID = `${order._id}-${Date.now()}`;

        const message =
            `total_amount=${order.totalAmount},` +
            `transaction_uuid=${transactionUUID},` +
            `product_code=${process.env.ESEWA_MERCHANT_CODE}`;

        const signature = generateSignature(

            message,

            process.env.ESEWA_SECRET_KEY

        );

        const paymentData = {

            amount: order.totalAmount,

            tax_amount: 0,

            total_amount: order.totalAmount,

            transaction_uuid: transactionUUID,

            product_code: process.env.ESEWA_MERCHANT_CODE,

            product_service_charge: 0,

            product_delivery_charge: 0,

            success_url: process.env.ESEWA_SUCCESS_URL,

            failure_url: process.env.ESEWA_FAILURE_URL,

            signed_field_names:
                "total_amount,transaction_uuid,product_code",

            signature

        };

        return res.status(200).json({

            message: "Payment initiated.",

            paymentData

        });

    } catch (error) {

        console.log("Initiate eSewa Payment Error:", error);

        return res.status(500).json({

            message: "Internal Server Error."

        });

    }

};

// ====================================
// Verify eSewa Payment
// ====================================

const verifyEsewaPaymentController = async (req, res) => {

    try {

        const { data } = req.query;

        if (!data) {

            return res.redirect(
                "http://localhost:5173/payment/failure"
            );

        }

        const decodedData = JSON.parse(

            Buffer.from(data, "base64").toString("utf8")

        );

        // Verify Signature

        if (!verifySignature(decodedData)) {

            return res.redirect(
                "http://localhost:5173/payment/failure"
            );

        }

        // Verify with eSewa Server

        const verificationResponse = await axios.get(

            "https://rc.esewa.com.np/api/epay/transaction/status/",

            {

                params: {

                    product_code: decodedData.product_code,

                    total_amount: decodedData.total_amount,

                    transaction_uuid: decodedData.transaction_uuid

                }

            }

        );

        // Find Order with the help of orderId

        const orderId = decodedData.transaction_uuid.split("-")[0];

const order = await Order.findById(orderId);

        if (!order) {

            return res.redirect(
                "http://localhost:5173/payment/failure"
            );

        }

        // Payment Failed Condition

        if (verificationResponse.data.status !== "COMPLETE") {

            order.paymentStatus = "Failed";

            await order.save();

            return res.redirect(
                "http://localhost:5173/payment/failure"
            );

        }

        // Payment Successful

        order.paymentStatus = "Paid";

        order.paymentId =
            verificationResponse.data.ref_id ||
            decodedData.transaction_code;

        order.transactionId =
            decodedData.transaction_uuid;

        order.paidAt = new Date();

        await order.save();

        // ====================================
// Mark Coupon As Used After Successful Payment
// ====================================

if (order.couponCode) {

    const coupon = await Coupon.findOne({
        code: order.couponCode,
        userId: order.userId,
        isUsed: false
    });

    if (coupon) {

        coupon.isUsed = true;

        await coupon.save();

        console.log(
            `Coupon ${coupon.code} marked as used.`
        );

    }

}

        return res.redirect(
            "http://localhost:5173/payment/success"
        );

    } catch (error) {

        console.log(
            "Verify eSewa Payment Error:",
            error
        );

        return res.status(500).json({

            message: "Internal Server Error."

        });

    }

};

module.exports = {

    initiateEsewaPaymentController,

    verifyEsewaPaymentController

};