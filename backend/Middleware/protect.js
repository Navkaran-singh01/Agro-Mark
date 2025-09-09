const jwt=require('jsonwebtoken');
const cookie=require('cookie');

require('dotenv').config();

const protect=(req,res,next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:'Token is empty'});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:'Token is Invalid'});
        }
        req.user=decoded;
        next();
    }
    catch(error){
        console.log('Error in protect middleware',error);
        return res.status(500).json({message:'Internal server error'});
    }
}

module.exports={protect};