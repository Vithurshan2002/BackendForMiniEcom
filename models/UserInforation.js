const mongoose=require('mongoose');

const UserSchema= new mongoose.Schema({
    Firstname:{
        type:String,
        required:true
    },
      Lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

},{
    timestamps:true,
})

const userDetailmodel=mongoose.model('userRegistraion',UserSchema);

module.exports=userDetailmodel;