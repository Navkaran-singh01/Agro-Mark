const mongoose=require('mongoose');
const product = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Farmer',
        default:[]
    },
    name:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },  
    picture:{
        type:String,
    }
})

const Product = mongoose.model('Product',product);
module.exports=Product;