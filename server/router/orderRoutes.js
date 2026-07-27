const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    createOrderController,
    getUserOrdersController,
    getSingleOrderController,
    cancelOrderController,
    getAllOrdersController,
    getSingleAdminOrderController,
    updateOrderStatusController,
    deleteOrderController
} = require("../controllers/orderController");

const router = express.Router();

// ===============================
// User Routes
// ===============================

router.post(
    "/",
    authMiddleware,
    createOrderController
);

router.get(
    "/",
    authMiddleware,
    getUserOrdersController
);

// ===============================
// Admin Routes
// ===============================

router.get(
    "/admin",
    authMiddleware,
    adminMiddleware,
    getAllOrdersController
);

router.get(
    "/admin/:id",
    authMiddleware,
    adminMiddleware,
    getSingleAdminOrderController
);

router.put(
    "/admin/:id/update",
    authMiddleware,
    adminMiddleware,
    updateOrderStatusController
);

router.delete(
    "/admin/:id/delete",
    authMiddleware,
    adminMiddleware,
    deleteOrderController
);

// ===============================
// User Dynamic Routes
// ===============================

router.get(
    "/:id",
    authMiddleware,
    getSingleOrderController
);

router.put(
    "/:id/cancel",
    authMiddleware,
    cancelOrderController
);

module.exports = router;