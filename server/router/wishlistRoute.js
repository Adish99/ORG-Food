const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    toggleWishlistController
} = require("../controllers/wishlistController");


// ==========================
// Wishlist Routes
// ==========================

router.route("/toggle")
    .post(
        authMiddleware,
        toggleWishlistController
    );


module.exports = router;