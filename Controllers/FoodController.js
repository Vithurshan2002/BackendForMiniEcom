const Desertsmodel = require("../models/Desserts");
const Maincoursesmodel = require("../models/Maincourses");
const PopularDishesmodel = require("../models/PopularDishes");
const Startersmodel = require("../models/Starters");

//GET STARTERS FOOD ITEMS
exports.getStarters = async (req, res, next) => {
  try {
    const items = await Startersmodel.find();
    if (items) {
      res.status(200).json({ valid: true, message:items });
    } else {
      res.status(400).json({ valid: false, message: "fooditems not exist" });
    }
  } catch (error) {
    res.status(400).json({ valid: false, message: `${error.message}` });
  }
};



//GET STARTERS FOOD ITEMS
exports.getMainCourses = async (req, res, next) => {
  try {
    const items = await Maincoursesmodel.find();
    if (items) {
      res.status(200).json({ valid: true, message:items });
    } else {
      res.status(400).json({ valid: false, message: "fooditems not exist" });
    }
  } catch (error) {
    res.status(400).json({ valid: false, message: `${error.message}` });
  }
};


//GET DESSERTS FOOD ITEMS
exports.getDesserts = async (req, res, next) => {
  try {
    const items = await Desertsmodel.find();
    if (items) {
      res.status(200).json({ valid: true, message:items });
    } else {
      res.status(400).json({ valid: false, message: "fooditems not exist" });
    }
  } catch (error) {
    res.status(400).json({ valid: false, message: `${error.message}` });
  }
};


//GET popular FOOD ITEMS
exports.getPopularDishes = async (req, res, next) => {
  try {
    const items = await PopularDishesmodel.find();
    if (items) {
      res.status(200).json({ valid: true, message:items });
    } else {
      res.status(400).json({ valid: false, message: "fooditems not exist" });
    }
  } catch (error) {
    res.status(400).json({ valid: false, message: `${error.message}` });
  }
};





