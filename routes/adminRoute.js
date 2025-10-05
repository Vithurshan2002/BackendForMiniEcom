const express=require("express");
const { registerAdmin, LoginAdmin } = require("../Controllers/AdminDetailsController");
const router=express.Router();

//admin regitration
router.post("/admin/register",registerAdmin);

//adminlogin
router.post("/admin/login",LoginAdmin);

module.exports=router;