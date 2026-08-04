const crypto = require("crypto");
const Order = require("../models/Order");

const generateSignature = (message, secret) => {

    return crypto

        .createHmac("sha256", secret)

        .update(message)

        .digest("base64");

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

        const message = `total_amount=${order.totalAmount},transaction_uuid=${order._id},product_code=${process.env.ESEWA_MERCHANT_CODE}`;

const signature = generateSignature(

    message,

    process.env.ESEWA_SECRET_KEY

);

const paymentData = {

    amount: order.totalAmount,

    tax_amount: 0,

    total_amount: order.totalAmount,

    transaction_uuid: order._id.toString(),

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

module.exports = {

    initiateEsewaPaymentController

};