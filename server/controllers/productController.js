const Product = require("../models/Product")

// Get all products with search, category, pagination and sorting
const getAllProductController = async (req, res) => {
  try {
    const {
      search,
      category,
      page = 1,
      limit = 5,
      sort,
    } = req.query;

    console.log("Category received:", category);

    // Filter object
    let filter = {};

    // Search by product name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by categoryId
    if(category){
    filter.categoryId = category;
}

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Sorting
    let sortOptions = {};

    if (sort === "price") {
      sortOptions = { price: 1 };
    } else if (sort === "-price") {
      sortOptions = { price: -1 };
    }


    // Get products
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));


    // Total products count
    const totalProducts = await Product.countDocuments(filter);

    return res.status(200).json({
      message: "Products fetched successfully",
      currentPage: Number(page),
      totalProducts,
      totalPages: Math.ceil(totalProducts / Number(limit)),
      products,
    });
  } catch (error) {
    console.log("getAllProducts error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

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