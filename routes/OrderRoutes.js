const express = require("express");
const {
  Addorder,
  getallOrder,
  updateOrderState,
} = require("../Controllers/OrderController");
const { varifyuser } = require("../middlewares/JWTmiddleware");
const router = express.Router();

//add the order
router.post("/addOrder", varifyuser, Addorder);

//for admin

//get the all order
router.get("/admin/getallorder", getallOrder);

//change the order status
router.put("/admin/updateorder/:id", updateOrderState);

module.exports = router;
