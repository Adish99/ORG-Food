const mongoose=require("mongoose");

//Schema creation
const userCartSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            quantity:{
                type:Number,
                required:true,
                default:1,
                min:1
            }
        }
    ]
},{
    timestamps:true
});

//Model creation
const Cart=mongoose.models.Cart || mongoose.model("Cart",userCartSchema);

module.exports=Cart;