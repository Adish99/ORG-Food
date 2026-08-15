const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    initiateEsewaPaymentController,
    verifyEsewaPaymentController
} = require("../controllers/paymentController");


// ====================================
// eSewa Initiate
// ====================================

router.post(
    "/esewa/initiate",
    authMiddleware,
    initiateEsewaPaymentController
);


// ====================================
// eSewa Verify
// ====================================

router.get(
    "/esewa/verify",
    verifyEsewaPaymentController
);


// ====================================
// eSewa Failure
// ====================================

router.get(
    "/esewa/failure",
    (req, res) => {

        console.log("🔥 eSEWA FAILURE ROUTE HIT");
        console.log("Failure Query:", req.query);

        res.json({
            message: "eSewa failure callback reached",
            query: req.query
        });

    }
);


module.exports = router;