const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const mySchema=mongoose.Schema({
    fname:{
        type:String,
        lowercase:true,
    },
    lname:{
        type:String,
        lowercase:true,
    },
    email:{
        type:String,
        unique:[true,"Email already present"],
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid Email");
            }
        }
    },
    gender:String,
    phone:{
        type:String,
        minlength:[10,"Invalid Phone Number"]
    },
    age:{
        type:Number,
        min:1,
        max:100
    },
    password:String,
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

mySchema.methods.generateAuthToken=async function()
{
    try {
        let token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

mySchema.pre("save",async function(next){
    if(this.isModified("password"))
    {
        this.password=await bcrypt.hash(this.password,12);
    }
    next();
})

const MyUser=mongoose.model("MyUser",mySchema);

module.exports=MyUser;