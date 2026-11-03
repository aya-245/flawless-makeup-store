const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String
    },
    numberOfItems: {
        type: Number
    }
}, {timestamps: true});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
