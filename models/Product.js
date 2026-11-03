const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  qupriceantity: {
    type: Number
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
