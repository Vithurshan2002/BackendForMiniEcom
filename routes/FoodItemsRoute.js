const express = require("express");
const {
  getStarters,
  getMainCourses,
  getDesserts,
  getPopularDishes,
  getallfooditems,
  deleteAfooditem,
  updatefooditem,
} = require("../Controllers/FoodController");
const { varifyuser } = require("../middlewares/JWTmiddleware");

const router = express.Router();

//for customers routes
router.get("/getStarters",varifyuser,getStarters);
router.get("/getMainCourses",varifyuser, getMainCourses);
router.get("/getDesserts",varifyuser, getDesserts);
router.get("/getPopularDishes", getPopularDishes);


//foradmins routes
router.get("/admin/getallfooditems",getallfooditems);
router.delete("/admin/deleteafooditem",deleteAfooditem);
router.put("/admin/updateafooditem",updatefooditem);

module.exports = router;
