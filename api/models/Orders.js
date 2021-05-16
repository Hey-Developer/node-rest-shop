const { Schema, model } = require("mongoose");

const orderSchema = Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    min: 1,
    default: 1,
  },
});

module.exports = model("Order", orderSchema);

//? We Provide ref in the productId which means that when we use POPULATE query then this path is replaced by the provided ref. in our case it is the product with the productID.
