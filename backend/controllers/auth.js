const User = require("../models/user")
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')


exports.getSignupController = (req,res,next)=> {
    res.send("<h1>This is signup route</h1>")
}

exports.getLoginController = (req, res, next) =>{
    res.send("<h1>This is login page</h1>")
}

exports.postSignupController = async (req, res, next) =>{
    console.log(req.body);
    const {email, password, name, country} = req.body;

    const hashedPw= await bcrypt.hash(password,12)

    const user= new User({
        email: email,
        password: hashedPw,
        name: name,
        country: country
    })

    user.save().then(result =>{
        console.log("User created successfully", result);
        res.json({ message: "User created successfully", userId: result._id });
    })
    .catch(err => {
        console.log(err)
    })
}

exports.postLoginController = (req, res, next) =>{
    const {email, password} = req.body;

    User.findOne({email})
    .then(user =>{
        if(!user)
            throw new Error('User does not exists');

        bcrypt.compare(password, user.password)
        .then(result =>{
            if(!result)
                throw new Error('Email/password incorrect');

            const token = jwt.sign({id: user._id.toString()},'somesupersecretsecret',{
                expiresIn: "1h"})

        res.json({userId: user._id, token: token})
        })
        .catch(err =>{
            console.log(err)
        })
    })
}