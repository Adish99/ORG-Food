const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    initiateEsewaPaymentController,
    verifyEsewaPaymentController

} = require("../controllers/paymentController");

router.post(

    "/esewa",

    authMiddleware,

    initiateEsewaPaymentController

);
router.get(

    "/esewa/success",

    verifyEsewaPaymentController

);

module.exports = router;