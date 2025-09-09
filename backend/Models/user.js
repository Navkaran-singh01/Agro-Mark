const mongoose=require('mongoose');

const user=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        unique:true,
        required:true,
    }
});

const User=mongoose.model('User',user);
module.exports=User;