const mongoose=require("mongoose");

require('dotenv').config();

exports.connectDB=async()=>{
    try{
        // NO OPTIONS NEEDED HERE FOR MODERN MONGOOSE
        await mongoose.connect(process.env.MONGO_URI); 

        console.log("database connected");
    }catch(error){
        console.error("Database connection failed. Error:", error.message);
        process.exit(1);
    }
}