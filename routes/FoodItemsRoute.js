const express = require("express");
const {
  getStarters,
  getMainCourses,
  getDesserts,
  getPopularDishes,
} = require("../Controllers/FoodController");
const { varifyuser } = require("../middlewares/JWTmiddleware");

const router = express.Router();

router.get("/getStarters",varifyuser,getStarters);
router.get("/getMainCourses",varifyuser, getMainCourses);
router.get("/getDesserts",varifyuser, getDesserts);
router.get("/getPopularDishes", getPopularDishes);

module.exports = router;
