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


    const signedFieldNames =
        decodedData.signed_field_names.split(",");

    const message =
        signedFieldNames
            .map(
                (fieldName) =>
                    `${fieldName}=${decodedData[fieldName]}`
            )
            .join(",");

    const expectedSignature =
        crypto
            .createHmac(
                "sha256",
                process.env.ESEWA_SECRET_KEY
            )
            .update(message)
            .digest("base64");


    return (
        expectedSignature ===
        decodedData.signature
    );

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

        console.log("===== eSEWA VERIFICATION START =====");
        console.log("Received data:", data);


        // ====================================
        // Check Response Data
        // ====================================

        if (!data) {

            console.log("eSewa data not received.");

            return res.redirect(
                "http://localhost:5173/payment/failure"
            );

        }


        // ====================================
        // Decode eSewa Response
        // ====================================

        const decodedData = JSON.parse(

            Buffer
                .from(data, "base64")
                .toString("utf8")

        );

        console.log(
            "Decoded eSewa Data:",
            decodedData
        );


        // ====================================
        // Verify Signature
        // ====================================

        const signatureValid =
            verifySignature(decodedData);

        console.log(
            "Signature Valid:",
            signatureValid
        );


        if (!signatureValid) {

            console.log(
                "eSewa signature verification failed."
            );

            return res.redirect(
                "http://localhost:5173/payment/failure"
            );

        }


        // ====================================
        // Verify Transaction With eSewa
        // ====================================

        const verificationResponse =
            await axios.get(

                "https://rc.esewa.com.np/api/epay/transaction/status/",

                {
                    params: {

                        product_code:
                            decodedData.product_code,

                        total_amount:
                            decodedData.total_amount,

                        transaction_uuid:
                            decodedData.transaction_uuid

                    }
                }

            );


        console.log(
            "eSewa Status Response:",
            verificationResponse.data
        );


        // ====================================
        // Find Order
        // ====================================

        const orderId =
            decodedData.transaction_uuid.split("-")[0];


        console.log(
            "Extracted Order ID:",
            orderId
        );


        const order =
            await Order.findById(orderId);


        if (!order) {

            console.log(
                "Order not found:",
                orderId
            );

            return res.redirect(
                "http://localhost:5173/payment/failure"
            );

        }


        // ====================================
        // Verify Amount
        // ====================================

        if (
            Number(decodedData.total_amount) !==
            Number(order.totalAmount)
        ) {

            console.log(
                "Amount mismatch!",
                "eSewa:",
                decodedData.total_amount,
                "Order:",
                order.totalAmount
            );

            order.paymentStatus = "Failed";

            await order.save();

            return res.redirect(
                "http://localhost:5173/payment/failure"
            );

        }


        // ====================================
        // Check Payment Status
        // ====================================

        if (
            verificationResponse.data.status !==
            "COMPLETE"
        ) {

            console.log(
                "eSewa payment is not COMPLETE:",
                verificationResponse.data.status
            );

            order.paymentStatus = "Failed";

            await order.save();

            return res.redirect(
                "http://localhost:5173/payment/failure"
            );

        }


        // ====================================
        // Payment Successful
        // ====================================

        order.paymentStatus = "Paid";

        order.paymentId =
            verificationResponse.data.ref_id ||
            decodedData.transaction_code;

        order.transactionId =
            decodedData.transaction_uuid;

        order.paidAt = new Date();


        await order.save();


        // ====================================
        // Mark Coupon As Used
        // ====================================

        if (order.couponCode) {

            const coupon =
                await Coupon.findOne({

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


                // ====================================
                // Increase Used Coupon Count
                // ====================================

                const user =
                    await User.findById(
                        order.userId
                    );


                if (user) {

                    user.usedCouponCount =
                        (user.usedCouponCount || 0) + 1;


                    await user.save();


                    // ====================================
                    // Check Special Coupon
                    // ====================================

                    await checkAndGenerateCoupons(
                        user._id
                    );

                }

            }

        }


        console.log(
            "===== eSEWA PAYMENT SUCCESS ====="
        );


        return res.redirect(
            "http://localhost:5173/payment/success"
        );


    } catch (error) {

        console.log(
            "Verify eSewa Payment Error:",
            error
        );


        return res.status(500).json({

            message:
                "Internal Server Error."

        });

    }

};

module.exports = {

    initiateEsewaPaymentController,

    verifyEsewaPaymentController

};