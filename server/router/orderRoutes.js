const express=require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {createOrderController,getUserOrdersController, getSingleOrderController, cancelOrderController, getAllOrdersController, getSingleAdminOrderController, updateOrderStatusController, deleteOrderController} = require("../controllers/orderController");
const router=express.Router();

//Routes
router.route("/").post(authMiddleware,createOrderController);
router.route("/").get(authMiddleware,getUserOrdersController);
router.route("/admin").get(getAllOrdersController);
router.route("/admin/:id").get(getSingleAdminOrderController);
router.route("/admin/:id/update").put(updateOrderStatusController);
router.route("/admin/:id/delete").delete(deleteOrderController);
router.route("/:id").get(authMiddleware,getSingleOrderController);
router.route("/:id/cancel").put(authMiddleware,cancelOrderController);


module.exports=router;