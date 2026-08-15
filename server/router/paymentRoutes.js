const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    initiateEsewaPaymentController,
    verifyEsewaPaymentController

} = require("../controllers/paymentController");

router.post(

    "/esewa/initiate",

    authMiddleware,

    initiateEsewaPaymentController

);
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