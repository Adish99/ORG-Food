const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getUserCouponsController,
    validateCouponController
} = require("../controllers/couponController");


router.get(
    "/",
    authMiddleware,
    getUserCouponsController
);


router.post(
    "/validate",
    authMiddleware,
    validateCouponController
);


module.exports = router;