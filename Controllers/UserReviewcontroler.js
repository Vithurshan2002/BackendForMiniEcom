const Reviewsmodel = require("../models/userReviews");

exports.getReviews = async (req, res, next) => {
  try {
    const items = await Reviewsmodel.find();
    if (items) {
      res.status(200).json({ valid: true, message:items });
    } else {
      res.status(400).json({ valid: false, message: "fooditems not exist" });
    }
  } catch (error) {
    res.status(400).json({ valid: false, message: `${error.message}` });
  }
};
