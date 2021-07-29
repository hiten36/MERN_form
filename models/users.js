const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

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
    password:String
})

mySchema.pre("save",async function(next){
    if(this.isModified("password"))
    {
        this.password=await bcrypt.hash(this.password,12);
    }
    next();
})

const MyUser=mongoose.model("MyUser",mySchema);

module.exports=MyUser;