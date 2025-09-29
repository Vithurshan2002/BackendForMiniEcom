const express = require("express");
const {
  getStarters,
  getMainCourses,
  getDesserts,
  getPopularDishes,
} = require("../Controllers/FoodController");

const router = express.Router();

router.get("/getStarters", getStarters);
router.get("/getMainCourses", getMainCourses);
router.get("/getDesserts", getDesserts);
router.get("/getPopularDishes", getPopularDishes);

module.exports = router;
