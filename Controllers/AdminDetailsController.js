const Adminmodel = require("../models/Adminmodel");

//admin registration
exports.registerAdmin = async (req, res, next) => {
  const { Firstname, email, phonenumber, address, password } = req.body;
  try {
    if (!Firstname || !email || !phonenumber || !password) {
      return res.status(404).json({ message: "All the fields are required" });
    }
    const data = await Adminmodel.create({
      Firstname,
      email,
      phonenumber,
      address,
      password,
    });
    if (data) {
      return res.status(200).json({ message: data });
    }
    return res.status(400).json({ message: "data not store" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// Admin login
exports.LoginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if ( !email || !password) {
      return res.status(404).json({ message: "All the fields are required" });
    }
    const data = await Adminmodel.create({
    });
    if (data) {
      return res.status(200).json({ message: data });
    }
    return res.status(400).json({ message: "data not store" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
