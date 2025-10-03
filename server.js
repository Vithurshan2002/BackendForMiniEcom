const express = require("express");
const cookieparser=require('cookie-parser');
const mongoose=require('mongoose');
const cors=require('cors');
require("dotenv").config();
const app = express();
const authRoutes=require('./routes/userRoutes');
const FoodRoutes=require("./routes/FoodItemsRoute")
const OrderRoutes=require("./routes/OrderRoutes")

app.use(cookieparser());
app.use(cors({
  origin:['http://localhost:5173'],
  credentials:true
}));
app.use(express.json());


app.use('/Bitza',authRoutes);
app.use("/Bitza",FoodRoutes)
app.use("/Bitza",OrderRoutes)



app.listen(process.env.PORT || 4500, () => {
  console.log(`server is Listening in the Port ${process.env.PORT}`);
});




//Mongodb connection
const mongoDB = mongoose.connect(`${process.env.MONGO_URL}/BitZa`).then(()=>{
    console.log("database successfully connected");
}).catch((error)=>{
    console.log("something oops"+ error.message)
})
