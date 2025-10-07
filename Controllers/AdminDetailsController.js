const Adminmodel = require("../models/Adminmodel");
const shippingmodal = require("../models/Shippingdetails");
const bcrypt = require("bcrypt");
const userDetailmodel = require("../models/UserInforation");
//admin registration
exports.registerAdmin = async (req, res, next) => {
  const { Firstname, email, phonenumber, address, password } = req.body;
  try {
    if (!Firstname || !email || !phonenumber || !password) {
      return res.status(404).json({ message: "All the fields are required" });
    }
    const useralreadyexist = await Adminmodel.findOne({ email: email });
    if (useralreadyexist) {
      return res.status(404).json({ message: "Email Already Exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const data = await Adminmodel.create({
      Firstname,
      email,
      phonenumber,
      address,
      password: hashpassword,
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
    if (!email || !password) {
      return res.status(404).json({ message: "All the fields are required" });
    }
    const user = await Adminmodel.findOne({ email: email }); //not send password
    if (!user) {
      return res.status(404).json({ message: "Email Does Not Exists" });
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return res.status(200).json({ message: user });
    }
    return res.status(400).json({ message: "Login Faild!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get restaurant product information for admin dash board
exports.getDetails = async (req, res, next) => {
  try {
    const usercount = await userDetailmodel.countDocuments();
    const ordercount = await shippingmodal.countDocuments();
    const shippingInfor = await shippingmodal.find();
    tot = 0;
    const totalincome = shippingInfor.reduce(
      (acc, item) => acc + Number(item.Totalprice),
      0
    );
    if (usercount && ordercount && shippingInfor) {
      return res
        .status(200)
        .json({ message: { usercount, ordercount, totalincome } });
    } else {
      return res.status(400).json({ message: "somthing error" });
    }
  } catch (error) {
    return res.status(500).json({ mesage: error.message });
  }
};
