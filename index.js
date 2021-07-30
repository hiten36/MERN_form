require('dotenv').config()
const express=require('express');
const path=require('path');
const exphbs=require('express-handlebars');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
require('./db/conn');
const users1=require('./models/users');
const auth=require('./middleware/auth');

const app=express();
const port=process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"static")));
app.engine('handlebars',exphbs());
app.set('view engine','handlebars');

app.get('/',(req,res)=>{
    res.render('index');
})
app.get('/regis',(req,res)=>{
    res.render('regis');
})
app.post('/regis',async (req,res)=>{
    let pass=req.body.password;
    let cpass=req.body.cpassword;
    if(pass===cpass)
    {
        let resp1=await users1.find({email:req.body.email}).countDocuments();
        if(resp1==0)
        {
            try {
                let nuser=new users1({
                    fname:req.body.fname,
                    lname:req.body.lname,
                    email:req.body.email,
                    gender:req.body.gender,
                    phone:req.body.phone,
                    age:req.body.age,
                    password:req.body.password
                });

                const token=await nuser.generateAuthToken();
                // console.log(token);

                res.cookie('jwt',token,{
                    expires:new Date(Date.now()+100000),
                    httpOnly:true
                });

                let resp=await nuser.save();
                res.render('regis',{flag:true,color:"success",msg:"Registration Successful, You can login now!"});
            } catch (error) {
                res.render('regis',{flag:true,color:"danger",msg:"Registration Failed, Some error occured, try again after sometime!"});
            }
        }
        else
        {
            res.render('regis',{flag:true,color:"danger",msg:"Registration Failed, Email already registered."});
        }
    }
    else
    {
        res.render('regis',{flag:true,color:"danger",msg:"Registration Failed, Recheck your password and try again."});
    }
})
app.post('/login',async(req,res)=>{
    try {
        var userPass=await users1.findOne({email:req.body.email});
        let isMatch=await bcrypt.compare(req.body.password,userPass.password);
        if(isMatch)
        {
            const token=await userPass.generateAuthToken();
            // console.log(token);
            res.cookie('jwt',token,{
                expires:new Date(Date.now()+100000),
                httpOnly:true
            });
            res.render('index',{flag:true,color:"success",msg:"Login Successful! "});
        }
        else
        {
            res.render('index',{flag:true,color:"danger",msg:"Login failed! Recheck your email or password and retry."});
        }
    } catch (error) {
        // console.log(error);
        res.render('index',{flag:true,color:"danger",msg:"Login failed! Try again after sometime."});
    }
})
app.get('/login',(req,res)=>{
    res.render('login');
})
app.get('/a',async (req,res)=>{
    let resp=await users1.find();
    res.send(resp);
})
app.get('/user', auth, (req,res)=>{
    res.render('user');
})
app.get('/logout',auth,async (req,res)=>{
    try {
        // console.log(req.user);

        // req.user.tokens=req.user.tokens.filter((e)=>{
        //     return (e.token!=req.token);
        // })

        req.user.tokens=[];

        res.clearCookie("jwt");
        await req.user.save();
        res.send('Logout Successfully');
    } catch (error) {
        res.send(error);
    }
})
app.listen(port,()=>{
    console.log('Listening at port ',port);
})