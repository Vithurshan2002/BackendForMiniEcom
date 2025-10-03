const express=require('express');
const { Addorder } = require('../Controllers/OrderController');
const { varifyuser } = require('../middlewares/JWTmiddleware');
const router=express.Router();

//add the order
router.post("/addOrder",varifyuser, Addorder)



module.exports=router;