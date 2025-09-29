const mongoose=require('mongoose');


const PopularSchema= new mongoose.Schema({
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

const PopularDishesmodel=mongoose.model('poppulardishes',PopularSchema);

module.exports=PopularDishesmodel;