const mongoose=require("mongoose");

//Schema creation for category 
const categorySchema=new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        minlength:2,
        maxlength:50
    },
        categoryImage:{
   type:String,
   required:true,
   trim:true
        },
},
{
    timestamps:true
}
);

//Model Creation for Catregory
const Category=mongoose.models.Category || mongoose.model("Category",categorySchema);

module.exports=Category;