const jwt=require('jsonwebtoken');
const users1= require('../models/users');

async function auth(req,res,next)
{
    try {
        let token=req.cookies.jwt;
        let verifyUser=jwt.verify(token,process.env.SECRET_KEY);
        // console.log(verifyUser);

        let user=await users1.findOne({_id:verifyUser._id});
        // console.log(user);

        req.token=token;
        req.user=user;

        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports=auth;