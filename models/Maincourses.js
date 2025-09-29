const mongoose=require('mongoose');


const MainCoursesSchema= new mongoose.Schema({
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

const Maincoursesmodel=mongoose.model('maincourses',MainCoursesSchema);

module.exports=Maincoursesmodel;