const mongoose=require('mongoose');

const farmer= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        unique:true,
        required:true,
    },
    address:{
        type:String,
        required:true,
    }
})

const Farmer=mongoose.model('Farmer',farmer);
module.exports=Farmer;