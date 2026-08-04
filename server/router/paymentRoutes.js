const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    initiateEsewaPaymentController

} = require("../controllers/paymentController");

router.post(

    "/esewa",

    authMiddleware,

    initiateEsewaPaymentController

);

module.exports = router;