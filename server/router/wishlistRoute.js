const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    toggleWishlistController,
    getWishlistController
} = require("../controllers/wishlistController");


// ==========================
// Wishlist Routes
// ==========================

router.route("/toggle")
    .post(
        authMiddleware,
        toggleWishlistController
    );

    router.route("/")
    .get(
        authMiddleware,
        getWishlistController
    );



module.exports = router;