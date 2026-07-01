const Product = require("../models/Product")

// Get all products with search, pagination and sorting
const getAllProductController = async(req,res)=>{

try{


const {
search,
page=1,
limit=5,
sort
}=req.query;



// Search filter
let filter={};


if(search){

filter={
name:{
$regex:search,
$options:"i"
}
}

}



// Pagination

const skip=(page-1)*limit;



// Sorting

let sortOptions={};


if(sort==="price"){

sortOptions={
price:1
};

}


if(sort==="-price"){

sortOptions={
price:-1
};

}



// Get Products

const products=await Product.find(filter)

.sort(sortOptions)

.skip(Number(skip))

.limit(Number(limit));




// Total count

const totalProducts=
await Product.countDocuments(filter);





return res.status(200).json({

message:"Product Found",

currentPage:Number(page),

totalProducts,

totalPages:
Math.ceil(totalProducts/limit),

products


});



}catch(error){


console.log(
"getAllProducts error:",
error
);


return res.status(500).json({

message:"Internal Server Error"

});


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