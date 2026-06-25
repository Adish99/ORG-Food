const express=require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {createOrderController,getUserOrdersController, getSingleOrderController, cancelOrderController} = require("../controllers/orderController");
const router=express.Router();

//Routes
router.route("/").post(authMiddleware,createOrderController);
router.route("/").get(authMiddleware,getUserOrdersController);
router.route("/:id").get(authMiddleware,getSingleOrderController);
router.route("/:id/cancel").put(authMiddleware,cancelOrderController);

module.exports=router;