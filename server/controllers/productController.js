const Product = require("../models/Product")

//Get all products by search functionality
const getAllProductController=async(req,res)=>{
    try{
const {search,page=1,limit=5,sort}=req.query;
if(!search){
    return res.status(400).json({message:"Please provide search value"});
}

//Pagination Calculation
const skip=(page-1)*limit;

//Sorting 
let sortOptions={};
if(sort){
    if(sort==="price"){
        sortOptions={price:1};
    }
    if(sort==="-price"){
        sortOptions={price:-1};
    }
}

const products=await Product.find({
    name:{
        $regex:search,
        $options:"i"
    }
})
.sort(sortOptions)
.skip(Number(skip))
.limit(Number(limit));

//Total search Products count
const totalProducts=await Product.countDocuments({
    name:{
        $regex:search,
        $options:"i"
    }
});

return res.status(200).json({
    message:"Product Found",
    currentPage:Number(page),
    totalProducts,
    totalPages:Math.ceil(totalProducts/limit),
    products
});
    }catch(error){
console.log("searchProductControllers error:",error);
return res.status(500).json({message:"Internal Server error!"});
    }
}

const getSpecificProdController=async(req,res)=>{
    try{
const id=req.params.id;
const data=await Product.findOne({_id:id});
console.log(data);
return res.status(200).json({data});
    }catch(error){
        console.log("getSpecificProduct error:",error);
        return res.status(404).json({message:"No product found!"});
    }
}

//Filtering category wise products
const getCategoryProductController=async(req,res)=>{
    try{
        const id=req.params.categoryId;
        const productResult=await Product.find({
            categoryId:id
        });
        return res.status(200).json({
            message:"Product found.",
            productResult
        })
    }catch(error){
        console.log("FilteringCategoryControllers error:",error);
        return res.status(500).json({message:"Internal server error!"});
    }
}

module.exports={getAllProductController,getSpecificProdController,getCategoryProductController};