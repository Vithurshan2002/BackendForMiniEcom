const userDetailmodel = require("../models/UserInforation");


//admin routes
//get all the user dertails
exports.getAlluserDeatails = async (req, res, next) => {
  try {
    const data = await userDetailmodel.find({}, { password: 0 });
    if (data) {
      return res.status(200).json({ message: data });
    }
    return res.status(400).json({ message: "data not exits" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//remove the user
exports.removeuser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await userDetailmodel.deleteOne({ _id: id });
    if (data.deletedCount > 0) {
      return res.status(200).json({ message: "Successfully Deleted" });
    }
    return res.status(400).json({ message: "user not Found " });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

