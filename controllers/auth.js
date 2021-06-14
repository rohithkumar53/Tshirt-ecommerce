const User = require("../models/user");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const { check, validationResult } = require('express-validator');
exports.signup=(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    const user=new User(req.body);
    user.save((err,user)=>{
        if(err){
            return res.status(400).json({
                err: "User not able to save to DB"
            })
        }
        res.json({
            name:user.name,
            email:user.email,
            id:user._id
        });
    })
};

exports.signin=(req, res)=>{
    const {email, password}= req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
    User.findOne({email}, (err, user)=>{
        if(err){
            res.status(400).json({
                error: "Some error occured"
            });
        }
        if(!user){
            return res.status(400).json({
                error: "User email doesn't exist"
            });
        }

        if(!user.authenticate(password)){
            return res.status(400).json({
                error: "Email and password do not match"
            });
        }
        // create token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        //put token in the cookie
        res.cookie("token", token, {expire: new Date()+9999});

        //send response to the frontend
        const {_id, name, email, role}=user;
        res.json({
            token,
            user:{_id,name, email, role}
        });
        
    })
}
exports.signout=(req,res)=>{
    res.clearCookie("token");
    res.json({
        message:"User signout"
    });
};

//protected routes

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});

// custom middlewares

exports.isAuthenticated=(req,res,next)=>{
    let checker= req.profile && req.auth && req.auth._id ==req.profile._id;
    if(!checker){
        return res.status(403).json({
            error:"ACCESS DENIED!!"
        });
    }

    next();
}

exports.isAdmin=(req,res,next)=>{
    if(req.profile.role===0){
        return res.status(403).json({
            error:"You are not an Admin, ACCESS DENIED!!"
        });
    }
    next();
}