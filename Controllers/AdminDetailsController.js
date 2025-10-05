const Adminmodel = require("../models/Adminmodel");
const userContactsmodel = require("../models/ContactMembers");
const shippingmodal = require("../models/Shippingdetails");

//admin registration
exports.registerAdmin = async (req, res, next) => {
  const { Firstname, email, phonenumber, address, password } = req.body;
  try {
    if (!Firstname || !email || !phonenumber || !password) {
      return res.status(404).json({ message: "All the fields are required" });
    }
    const useralreadyexist = await Adminmodel.findOne();
    if (useralreadyexist) {
      return res.status(404).json({ message: "Email Already Exists." });
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
    if (!email || !password) {
      return res.status(404).json({ message: "All the fields are required" });
    }
    const user = await Adminmodel.findOne({ email: email }); //not send password
    if (!user) {
      return res.status(404).json({ message: "Email Does Not Exists" });
    }
    if (user.password === password) {
      return res.status(200).json({ message: "login successfully" });
    }
    return res.status(400).json({ message: "Login Faild!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get restaurant product information for admin dash board
exports.getDetails = async (req, res, next) => {
  try {
    const usercount = await userContactsmodel.countDocuments();
    const ordercount = await shippingmodal.countDocuments();
    const shippingInfor = await shippingmodal.find();
    tot = 0;
    const totalincome = shippingInfor.reduce(
      (acc, item) => acc + Number(item.Totalprice),
      0
    );
    if (usercount && ordercount && shippingInfor) {
      return res.status(200).json({message:{ usercount, ordercount, totalincome }});
    } else {
      return res.status(400).json({ message: "somthing error" });
    }
  } catch (error) {
    return res.status(500).json({ mesage: error.message });
  }
};
