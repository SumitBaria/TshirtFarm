const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 9,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    stock: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 9,
    },
    sold: {
      type: Number,
      trim: true,
      maxlength: 9,
      default: 0,
    },
    feature: {
      type: Boolean,
    },
    offer: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
