const express = require("express");
const {
  registerAdmin,
  LoginAdmin,
  getDetails,
} = require("../Controllers/AdminDetailsController");
const router = express.Router();

//admin regitration
router.post("/admin/register", registerAdmin);

//adminlogin
router.post("/admin/login", LoginAdmin);

//get some data for the dashboard (number of order ,users ,and total income)
router.get("/admin/getdetails", getDetails);
module.exports = router;
