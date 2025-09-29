const mongoose=require('mongoose');


const DessertsSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
      price:{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    }

},{
    timestamps:true,
})

const Desertsmodel=mongoose.model('deserts',DessertsSchema);

module.exports=Desertsmodel;