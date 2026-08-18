require("dotenv").config({override:true});
const dbConnection=require("./utils/dbConnection");
const express=require("express");
const cors=require("cors");
const userRoutes=require("./router/userRoutes");
const productRoutes=require("./router/productRoutes");
const contactRoutes=require("./router/contactRoutes");
const cartRoutes=require("./router/cartRoutes");
const orderRoutes=require("./router/orderRoutes");
const categoryRoutes=require("./router/categoryRoutes");
const adminRoutes=require("./router/adminRoutes");
const paymentRoute=require("./router/paymentRoutes");
const profileRoute=require("./router/profileRoutes");
const reviewRoute=require("./router/reviewRoute");
const wishlistRoute=require("./router/wishlistRoute");
const couponRouter=require("./router/couponRouter");
const app=express();
const PORT=process.env.PORT || 3000;
//Change corsOptions for deployment
const corsOptns = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"],
    credentials: true
};

//CORS middleware
app.use(cors(corsOptns));

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
app.use("/api/contact", contactRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/category",categoryRoutes);
app.use("/api",adminRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/profile", profileRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/coupon",couponRouter);

//Server Running
app.listen(PORT,async()=>{
    console.log("Server running on the port number",PORT);
    await dbConnection();
})