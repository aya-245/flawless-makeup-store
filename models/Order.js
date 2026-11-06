const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: Number
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number
    },
    price: {
      type: Number
    },
  }],
  total: {
    type: Number
  }
}, {timestamps: true});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
