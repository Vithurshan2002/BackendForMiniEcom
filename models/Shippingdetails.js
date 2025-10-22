const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalcode: { type: String, required: true },
  country: { type: String, required: true },
});

const shippingSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: AddressSchema,
      required: true,
    },
    phonenumber: {
      type: String,
      required: true,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number,default:3},
      },
    ],
    Totalprice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
      default: () => new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    },

    isPaid: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

const shippingmodal = mongoose.model("shippingInformation", shippingSchema);

module.exports = shippingmodal;
