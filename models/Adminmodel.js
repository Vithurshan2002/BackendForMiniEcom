const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    Firstname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Adminmodel = mongoose.model("AdminRegistraion", AdminSchema);

module.exports = Adminmodel;
