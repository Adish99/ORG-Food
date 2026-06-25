const Order=require("../models/Order");
const Cart=require("../models/UserCart");

//Create Order
const createOrderController=async(req,res)=>{
    try{
        const userId=req.user._id;

        const {shippingAddress,paymentMethod}=req.body;

        const cart=await Cart.findOne({userId})
        .populate("products.productId");

         if(!cart || cart.products.length===0){
            return res.status(400).json({
                message:"Cart is empty"
            });
        }

         let totalAmount=0;

          cart.products.forEach((item)=>{
            totalAmount += 
            item.productId.price * item.quantity;
        });

         const order = await Order.create({
            userId,
           products:cart.products.map((item)=>({
    productId:item.productId._id,
    name:item.productId.name,
    price:item.productId.price,
    quantity:item.quantity
})),
            totalAmount,
            shippingAddress,
            paymentMethod
        });

 // Clear cart after order
        cart.products=[];
        await cart.save();

        return res.status(201).json({
            message:"Order created successfully",
            order
        });
   
    }catch(error){
        console.log("Create order error:",error);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}

// Get User Orders
const getUserOrdersController = async(req,res)=>{

    try{

        const userId=req.user._id;

        const orders = await Order.find({userId})
        .populate("products.productId")
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

module.exports={createOrderController,getUserOrdersController,getSingleOrderController,cancelOrderController};