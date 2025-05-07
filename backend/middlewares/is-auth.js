require('dotenv').config()
const jwt= require('jsonwebtoken')

exports.isAuth = (req, res, next)=>{
    const authHeader= req.get('Authorization')
    if(!authHeader)
        throw new Error('Not authorized')

    const token= authHeader.split(' ')[1];
    if(!token)
        throw new Error('Not Authorized')

    try{
        const decodedToken = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
        req.user= decodedToken;
        next();
    }
    catch(err){
        throw err;
    }
}