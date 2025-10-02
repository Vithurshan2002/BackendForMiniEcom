const mongoose=require('mongoose');


const ContactSchema= new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
      email:{
        type:String,
        required:true
    },
    contactno:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
},{
    timestamps:true,
})

const userContactsmodel=mongoose.model('contact_members',ContactSchema);

module.exports=userContactsmodel;