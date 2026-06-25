const Cart=require("../models/UserCart");
const Product=require("../models/Product");


//Add to cart
const addToCartController=async(req,res)=>{

    try{
        const userId=req.user._id;
        const {productId,quantity}=req.body;
        const productExists=await Product.findById(productId);


        if(!productExists){
     return res.status(404).json({
                message:"Product not found!"
            });

        }

        let cart=await Cart.findOne({userId});

        // First time cart creation
        if(!cart){
         cart=await Cart.create({
                userId,
                products:[
                    {
                        productId,
                        quantity
                    }
                ]
            });
        }
        else{
            const productIndex=cart.products.findIndex(
         (item)=>
                item.productId.toString()===productId

            );

            // Product already exists
            if(productIndex > -1){
                cart.products[productIndex].quantity += quantity;
            }

            // New product add
            else{
                cart.products.push({

                    productId,
                    quantity

                });

            }
            await cart.save();

        }
        return res.status(200).json({
          message:"Product added to cart successfully",
            cart
        });



    }catch(error){

        console.log("AddToCartController error:",error);

        return res.status(500).json({

            message:"Something went wrong!"

        });

    }
}

//R in (CRUD) Get User cart
const getUserCartController=async(req,res)=>{
    try{
        const userId=await req.user._id;
        const cart=await Cart.findOne({userId})
         .populate("products.productId");

        if(!cart){
            return res.status(404).json({message:"Cart is Empty!"});
        }

        return res.status(200).json({
            message:"Cart Fetched successfully.",
            cart
        })
    }catch(error){
        console.log("Fetch usercart controllers error:",error);
        return res.status(500).json({message:"Something went wrong!"});
    }
}

//U in (CRUD) update user cart 
//Update Cart Quantity
const updateCartQuantityController = async(req,res)=>{

    try{

        const userId=req.user._id;

        const {productId,quantity}=req.body;


        const cart = await Cart.findOne({userId});


        if(!cart){

            return res.status(404).json({
                message:"Cart not found"
            });

        }



        const productIndex = cart.products.findIndex(
            (item)=>
            item.productId.toString()===productId
        );

        if(productIndex === -1){

            return res.status(404).json({
                message:"Product not found in cart"
            });

        }

        // Update quantity

        cart.products[productIndex].quantity = quantity;
        if(quantity < 1){
return res.status(400).json({
 message:"Quantity must be at least 1"
});

}
        await cart.save();
        return res.status(200).json({
            message:"Cart quantity updated successfully",
            cart
        });
    }catch(error){
     console.log("Update cart quantity error:",error);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}

//D in CRUD / Remove product from userCart
const removeCartProductController=async(req,res)=>{
     try{

        const userId=req.user._id;

        const {productId}=req.body;


        const cart=await Cart.findOne({userId});


        if(!cart){
            return res.status(404).json({
                message:"Cart not found"
            });

        }


        const productExists = cart.products.some(
          (item)=>
            item.productId.toString()===productId
        );


        if(!productExists){
            return res.status(404).json({
                message:"Product not found in cart"
            });

        }

        cart.products = cart.products.filter(
           (item)=>
            item.productId.toString()!==productId
        );
        await cart.save();
        return res.status(200).json({
            message:"Product removed from cart successfully",
        cart
        });
    }catch(error){
        console.log("Remove cart product error:",error);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}


module.exports={addToCartController,getUserCartController,updateCartQuantityController,removeCartProductController};