const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/users1',{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false,useUnifiedTopology:true}).then(()=>{
    console.log("Database connection successful");
}).catch((err)=>{
    console.log(err);
})