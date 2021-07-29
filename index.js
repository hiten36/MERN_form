const express=require('express');
const path=require('path');
const exphbs=require('express-handlebars');
const bcrypt=require('bcryptjs');
require('./db/conn');
const users1=require('./models/users');

const app=express();
const port=process.env.PORT || 8000;

app.use(express.json());
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
        let userPass=await users1.find({email:req.body.email});
        let isMatch=await bcrypt.compare(req.body.password,userPass[0].password);
        if(isMatch)
        {
            res.render('index',{flag:true,color:"success",msg:"Login Successful! "});
        }
        else
        {
            res.render('index',{flag:true,color:"danger",msg:"Login failed! Recheck your email or password and retry."});
        }
    } catch (error) {
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
app.listen(port,()=>{
    console.log('Listening at port ',port);
})