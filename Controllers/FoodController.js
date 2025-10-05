const Desertsmodel = require("../models/Desserts");
const Maincoursesmodel = require("../models/Maincourses");
const PopularDishesmodel = require("../models/PopularDishes");
const Startersmodel = require("../models/Starters");

//GET STARTERS FOOD ITEMS
exports.getStarters = async (req, res, next) => {
  try {
    const items = await Startersmodel.find();
    if (items) {
      res.status(200).json({ valid: true, message: items });
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
      res.status(200).json({ valid: true, message: items });
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
      res.status(200).json({ valid: true, message: items });
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
      res.status(200).json({ valid: true, message: items });
    } else {
      res.status(400).json({ valid: false, message: "fooditems not exist" });
    }
  } catch (error) {
    res.status(400).json({ valid: false, message: `${error.message}` });
  }
};

//admin routes

//get all the food items for admin
exports.getallfooditems = async (req, res, next) => {
  try {
    const populardishes = await PopularDishesmodel.find();
    const maincourses = await Maincoursesmodel.find();
    const dessertsdishes = await Desertsmodel.find();
    const starterscourses = await Startersmodel.find();
    if (populardishes && maincourses && dessertsdishes && starterscourses) {
      res.status(200).json({
        message: {
          populardishes,
          maincourses,
          dessertsdishes,
          starterscourses,
        },
      });
    } else {
      res.status(400).json({ message: "fooditems not exist" });
    }
  } catch (error) {
    res.status(400).json({ message: `${error.message}` });
  }
};

//delete a spicific food based on catecory
const categoryMap = {
  popular: PopularDishesmodel,
  desserts: Desertsmodel,
  main: Maincoursesmodel,
  starters: Startersmodel,
};

exports.deleteAfooditem = async (req, res) => {
  const { category, id } = req.body;

  try {
    const Model = categoryMap[category];
    if (!Model) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const result = await Model.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot delete item because: " + error.message,
    });
  }
};

//update a food item

exports.updatefooditem = async (req, res) => {
  const categoryMap = {
    popular: PopularDishesmodel,
    desserts: Desertsmodel,
    main: Maincoursesmodel,
    starters: Startersmodel,
  };
  const { id, category, name, price, image } = req.body;

  if (!id || !category) {
    return res
      .status(400)
      .json({ message: "Product ID and category are required" });
  }

  try {
    const Model = categoryMap[category];
    if (!Model) return res.status(400).json({ message: "Invalid category" });

    const updatedProduct = await Model.findByIdAndUpdate(
      id,
      { name, price, image },
      { new: true } // return updated document
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Cannot update product: " + error.message,
    });
  }
};

//ADDA FOODITEM BAED ON CATEGORY
exports.addFoodItem = async (req, res) => {
  try {
    const { name, price, image, category } = req.body;

    if (!name || !price || !image || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const categoryModels = {
      popular: PopularDishesmodel,
      desserts: Desertsmodel,
      main: Maincoursesmodel,
      starters: Startersmodel,
    };

    const Model = categoryModels[category.toLowerCase()];
    if (!Model) {
      return res.status(400).json({ message: "Invalid category" });
    }

  
    const newItem = new Model({ name, price, image });
    await newItem.save();

    res.status(201).json({ message: "Food item added successfully", item: newItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
