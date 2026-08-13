const Order=require("../models/Order");
const Cart=require("../models/UserCart");
const Coupon=require("../models/Coupon");
const {checkAndGenerateCoupons} = require("./couponController");

// ====================================
// Create Order
// ====================================

const createOrderController = async (req, res) => {

    try {

        const userId = req.user._id;

        const {
            shippingAddress,
            paymentMethod,
            couponCode
        } = req.body;


        // ====================================
        // Get Cart
        // ====================================

        const cart = await Cart.findOne({
            userId
        }).populate("products.productId");


        if (!cart || cart.products.length === 0) {

            return res.status(400).json({
                message: "Cart is empty."
            });

        }


        // ====================================
        // Calculate Subtotal
        // ====================================

        let subtotal = 0;

        cart.products.forEach((item) => {

            subtotal +=
                item.productId.price *
                item.quantity;

        });


        // ====================================
        // Delivery Charge
        // ====================================

        const deliveryCharge =
            subtotal >= 1000 ? 0 : 100;


        const grandTotal =
            subtotal + deliveryCharge;


        // ====================================
        // Coupon
        // ====================================

        let discountAmount = 0;

        let validCoupon = null;


        if (couponCode) {

            validCoupon = await Coupon.findOne({

                code: couponCode.toUpperCase().trim(),

                userId,

                isUsed: false

            });


            if (!validCoupon) {

                return res.status(400).json({
                    message: "Invalid or unavailable coupon."
                });

            }


            // Check expiry

            if (
                validCoupon.expiryDate <=
                new Date()
            ) {

                return res.status(400).json({
                    message: "This coupon has expired."
                });

            }


            // Calculate discount

            if (
                validCoupon.discountType ===
                "percentage"
            ) {

                discountAmount =
                    (grandTotal *
                        validCoupon.discountValue) /
                    100;

            } else {

                discountAmount =
                    validCoupon.discountValue;

            }


            // Prevent discount exceeding total

            if (discountAmount > grandTotal) {

                discountAmount = grandTotal;

            }

        }


        // ====================================
        // Final Total
        // ====================================

        const totalAmount =
            grandTotal - discountAmount;


        // ====================================
        // Create Order
        // ====================================

        const order = await Order.create({

            userId,

            products: cart.products.map((item) => ({

                productId: item.productId._id,

                name: item.productId.name,

                price: item.productId.price,

                quantity: item.quantity

            })),

            totalAmount,

            couponCode:
                validCoupon
                    ? validCoupon.code
                    : null,

            discountAmount,

            shippingAddress,

            paymentMethod,

            paymentStatus: "Pending"

        });


        // ====================================
        // Mark Coupon As Used
        // ====================================

        if (validCoupon) {

            validCoupon.isUsed = true;

            await validCoupon.save();

        }


        // ====================================
        // Clear Cart
        // ====================================

        cart.products = [];

        await cart.save();


        return res.status(201).json({

            message:
                "Order created successfully.",

            order

        });


    } catch (error) {

        console.log(
            "Create Order Error:",
            error
        );

        return res.status(500).json({

            message:
                "Internal Server Error."

        });

    }

};

// Get User Orders
const getUserOrdersController = async(req,res)=>{

    try{

        const userId=req.user._id;

        const orders = await Order.find({userId})
        .populate("products.productId","image weight")
        .sort({createdAt:-1});


        if(!orders || orders.length===0){

            return res.status(404).json({
            message:"No orders found"
            });
        }

        return res.status(200).json({
            message:"Orders fetched successfully",
            orders
        });

    }catch(error){
        console.log("Get user orders error:",error);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}

// Get Single Order
const getSingleOrderController = async(req,res)=>{

    try{

        const userId=req.user._id;
        const orderId=req.params.id;

        const order = await Order.findOne({
            _id:orderId,
            userId:userId
        })
        .populate("products.productId");

        if(!order){
            return res.status(404).json({
                message:"Order not found"
            });
        }

        return res.status(200).json({
            message:"Order fetched successfully",
            order
        });

    }catch(error){
        console.log("Get single order error:",error);

        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}

// Cancel Order
const cancelOrderController = async(req,res)=>{

    try{

        const userId=req.user._id;

        const orderId=req.params.id;



        const order = await Order.findOne({

            _id:orderId,

            userId:userId

        });


        if(!order){

            return res.status(404).json({

                message:"Order not found"

            });

        }

        // Check current status

        if(
            order.orderStatus==="Delivered" ||
            order.orderStatus==="Cancelled"
        ){

            return res.status(400).json({
                message:"Order cannot be cancelled"
            });
        }

        order.orderStatus="Cancelled";

        await order.save();

        return res.status(200).json({

            message:"Order cancelled successfully",
         order
        });

    }catch(error){
        console.log("Cancel order error:",error);

        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}

// ====================================
// Get All Orders (Admin)
// ====================================

const getAllOrdersController = async (req, res) => {

    try {

        const orders = await Order.find()

            .populate(
                "userId",
                "username email phone"
            )

            .populate(
                "products.productId",
                "name image weight"
            )

            .sort({
                createdAt: -1
            });

        return res.status(200).json({

            message: "Orders fetched successfully.",

            orders

        });

    } catch (error) {

        console.log(
            "Get All Orders Error:",
            error
        );

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

// ====================================
// Admin Get Single Order
// ====================================

const getSingleAdminOrderController = async (req, res) => {

    try {

        const { id } = req.params;

        const order = await Order.findById(id)

            .populate(
                "userId",
                "username email phone"
            )

            .populate(
                "products.productId"
            );

        if (!order) {

            return res.status(404).json({
                message: "Order not found."
            });

        }

        return res.status(200).json({

            message: "Order fetched successfully.",

            order

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

// ====================================
// Update Order Status (Admin)
// ====================================

const updateOrderStatusController = async (req, res) => {
    try {

        const { id } = req.params;

        const { orderStatus } = req.body;

        const validStatus = [

            "Pending",

            "Processing",

            "Shipped",

            "Delivered",

            "Cancelled"

        ];

        if (!validStatus.includes(orderStatus)) {

            return res.status(400).json({

                message: "Invalid order status."

            });

        }

        const order = await Order.findById(id);

        if (!order) {

            return res.status(404).json({

                message: "Order not found."

            });

        }

        order.orderStatus = orderStatus;

        await order.save();

        if (orderStatus === "Delivered") {

    await checkAndGenerateCoupons(
        order.userId
    );

}

        return res.status(200).json({

            message: "Order status updated successfully.",

            order

        });

    } catch (error) {

        console.log("Update Order Status Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

// ====================================
// Delete Order (Admin)
// ====================================

const deleteOrderController = async (req, res) => {

    try {

        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {

            return res.status(404).json({
                message: "Order not found."
            });

        }

        if (
            order.orderStatus !== "Cancelled" &&
            order.orderStatus !== "Delivered"
        ) {

            return res.status(400).json({
                message: "Only delivered or cancelled orders can be deleted."
            });

        }

        await Order.findByIdAndDelete(id);

        return res.status(200).json({

            message: "Order deleted successfully."

        });

    } catch (error) {

        console.log("Delete Order Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

module.exports={createOrderController,getUserOrdersController,getSingleOrderController,cancelOrderController,getAllOrdersController,getSingleAdminOrderController,updateOrderStatusController,deleteOrderController};