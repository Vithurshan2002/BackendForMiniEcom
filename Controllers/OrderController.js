const shippingmodal = require("../models/Shippingdetails");

exports.Addorder = async (req, res, next) => {
  const { fullname, email, address, phonenumber, orderItems, Totalprice } =
    req.body;
  try {
    if (
      fullname &&
      email &&
      address &&
      phonenumber &&
      orderItems &&
      Totalprice
    ) {
      const data = await shippingmodal.create({
        fullname,
        email,
        address,
        phonenumber,
        orderItems,
        Totalprice,
      });
      if (data) {
        return res.status(200).json({ message: "Your Order has been placed" });
      }
      return res.status(400).json({ message: "Order not placed" });
    } else {
      return res.status(404).json({ message: "Give the full details" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
