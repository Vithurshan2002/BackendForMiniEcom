const express = require("express");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const authRoutes = require("./routes/userRoutes");
const FoodRoutes = require("./routes/FoodItemsRoute");
const OrderRoutes = require("./routes/OrderRoutes");
const UserDetails = require("./routes/userdeatilsRoutes");
const AdminDetails = require("./routes/adminRoute");
app.use(cookieparser());
app.use(
  cors({
    origin: ["https://bitza-restaurant.vercel.app", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/Bitza", authRoutes);
app.use("/Bitza", FoodRoutes);
app.use("/Bitza", OrderRoutes);
app.use("/Bitza", UserDetails);

app.use("/Bitza", AdminDetails);

app.listen(process.env.PORT || 4500, () => {
  console.log(`server is Listening in the Port ${process.env.PORT}`);
});

//Mongodb connection
const mongoDB = mongoose
  .connect(process.env.CLOUD_MONGO_url)    /*  `${process.env.MONGO_URL}/BitZa` */
  .then(() => {
    console.log("database successfully connected");
  })
  .catch((error) => {
    console.log("something oops" + error.message);
  });
