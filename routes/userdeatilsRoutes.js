const express=require("express");
const { getAlluserDeatails, removeuser } = require("../Controllers/UserDetailsController");
const   router=express.Router();

//get all the user details
router.get("/admin/getuserdetails",getAlluserDeatails);

//remove the user
router.delete("/admin/removeuser/:id",removeuser)

module.exports=router;