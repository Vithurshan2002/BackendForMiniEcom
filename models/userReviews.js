const mongoose=require('mongoose');


const userReviewSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
      image:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        required:true
    }

},{
    timestamps:true,
})

const Reviewsmodel=mongoose.model('userreviews',userReviewSchema);

module.exports=Reviewsmodel;