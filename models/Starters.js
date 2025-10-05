const mongoose=require('mongoose');


const StartersSchema= new mongoose.Schema({
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
       default:3
    },
    image:{
        type:String,
        required:true
    }

},{
    timestamps:true,
})

const Startersmodel=mongoose.model('starters',StartersSchema);

module.exports=Startersmodel;