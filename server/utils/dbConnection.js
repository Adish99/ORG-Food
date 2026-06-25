const mongoose=require("mongoose");

//Connection creation function
const dbConnection=async()=>{
    try{
        const connectionStr=await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7xx6ohc.mongodb.net/${process.env.DB_NAME}?appName=Cluster0`);
       console.log("Connection Successful.");
    }catch(error){
        console.log(`No connection! ${error}`);
        process.exit(1);
    }
}
module.exports=dbConnection;