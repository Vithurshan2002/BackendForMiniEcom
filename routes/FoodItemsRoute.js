const express = require("express");
const {
  getStarters,
  getMainCourses,
  getDesserts,
  getPopularDishes,
  getallfooditems,
  deleteAfooditem,
  updatefooditem,
  addFoodItem,
} = require("../Controllers/FoodController");
const { varifyuser } = require("../middlewares/JWTmiddleware");

const router = express.Router();

//for customers routes
router.get("/getStarters",getStarters);
router.get("/getMainCourses", getMainCourses);
router.get("/getDesserts", getDesserts);
router.get("/getPopularDishes", getPopularDishes);


//foradmins routes
router.get("/admin/getallfooditems",getallfooditems);
router.delete("/admin/deleteafooditem",deleteAfooditem);
router.put("/admin/updateafooditem",updatefooditem);
router.post("/admin/addfooditem",addFoodItem);

module.exports = router;
