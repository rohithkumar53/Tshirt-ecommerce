const User= require("../models/user");
const Order= require("../models/order");

exports.getUserById=(req,res,next,id)=>{
    User.findById(id, (err, user)=>{
        if(err || !user){
            return res.status(400).json({
                err:"Error occured, not able to find user in DB!!"
            });
        }
        req.profile=user;
        next();
    })
}
exports.getUser=(req,res)=>{
    req.profile.salt=undefined;
    req.profile.encry_password=undefined;
    // req.profile.createdAt=undefined;
    // req.profile.updatedAt=undefined;
    return res.json(req.profile);
}

exports.updateUser=(req,res)=>{
    User.findByIdAndUpdate(
         req.profile._id,
        {$set: req.body},
        {new: true, useFindAndModify:false},
        (err, user)=>{
            if(err){
                res.status(400).json({
                    error:"You cannot update this user"
                });
            }
            user.salt=undefined;
            user.encry_password=undefined;
            res.json(user);
        }
    )
}

exports.userPurchaseList=(req,res)=>{
    Order.find({user: req.profile._id})
    .populate("user", "_id name")
    .exec((err, order)=>{
        if(err){
            return res.status(400).json({
                error:"No order in this account"
            })
        }
        return res.json(order);
    })
}

exports.pushOrderInPurchaseList = (req, res, next)=>{
    console.log("push order in purchase list");
    let purchases=[];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });
    // store this in DB
    User.findByIdAndUpdate(
         req.profile._id,
        {$push: {purchases: purchases}},
        {new: true, useFindAndModify:false},
        (err, purchases)=>{
            if(err){
                return res.status(400).json({
                    error: "Unable to save purchase list"
                });
            }
            next();
        }
    );
}
// exports.getAllUsers=(req,res)=>{
//     User.find().exec((err,users)=>{
//         if(err || !users){
//             return res.status(400).json({
//                 err:"Error occured, not able to find users in DB!!"
//             });
//         }
//         return res.json(users);
//     })
// }