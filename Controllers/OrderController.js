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

//admin routes
//get all the userorder details
exports.getallOrder = async (req, res, next) => {
  try {
    const data = await shippingmodal.find();
    if (data) {
      return res.status(200).json({ message: data });
    }
    return res.status(404).json({ message: "orders not exists" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//change the order status

exports.updateOrderState= async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    const order = await shippingmodal.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status; // Update status
    await order.save();
    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (err) {
    res.status(500).json({ error:err.message });
  }
}
















