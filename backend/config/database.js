const mongoose=require("mongoose");

require('dotenv').config();

exports.connectDB=async()=>{
try{
    await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    });
    console.log("database connected");
}catch(error){
        console.error("Database connection failed. Error:", error.message);
        process.exit(1);
}
}