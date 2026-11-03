const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: Number
  },
  price: {
    type: Number
  },
  quantity: {
    type: Number
  },
  isDelivered: {
    type: Boolean
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  product: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {timestamps: true});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
