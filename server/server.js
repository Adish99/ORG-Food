require("dotenv").config({override:true});
const dbConnection=require("./utils/dbConnection");
const express=require("express");
const userRoutes=require("./router/userRoutes");
const productRoutes=require("./router/productRoutes");
const cartRoutes=require("./router/cartRoutes");
const orderRoutes=require("./router/orderRoutes");
const app=express();
const PORT=process.env.PORT_NO || 3000;

//Normal middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Routes
app.get("/",(req,res)=>{
    res.status(200).send("Home-page");
});

// Router Middlewaress
app.use("/api",userRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/order",orderRoutes);

//Server Running
app.listen(PORT,async()=>{
    console.log("Server running on the port number",PORT);
    await dbConnection();
})