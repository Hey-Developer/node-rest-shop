const Order = require("../models/Orders");
const Product = require("../models/Products");

exports.getAllOrder = async (req, res, next) => {
  // Here we use populate Query in first param you can select the collection from which you want docs and the second param you can select no. of field to show from that document.
  try {
    const result = await Order.find()
      .select("quantity product _id")
      .populate("product", "name");
    if (result.length > 0) {
      res.status(200).json({
        status: "Success",
        message: `Here is the list of all the orders Placed`,
        totalOrders: result.length,
        Orders: result.map((order) => {
          return {
            orderId: order._id,
            product: order.product,
            quantity: order.quantity,
            request: {
              type: "GET",
              description: "To see the order details",
              url: "http://localhost:8000/orders/" + order._id,
            },
          };
        }),
      });
    } else {
      res.status(200).json({
        status: "Success",
        totalOrders: result.length,
        message: `No Orders Available, Please order some products`,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};

exports.placeOrder = async (req, res, next) => {
  try {
    const product = await Product.findById();
    if (!product) {
      return res.status(404).json({
        status: "Product Not Found",
        message: "Invalid Product Id",
      });
    }

    const newOrder = new Order({
      product: req.body.productId,
      quantity: req.body.quantity,
    });
    const result = await newOrder.save();
    res.status(201).json({
      status: "Success",
      message: "New Order Placed successfully",
      newOrder: {
        orderId: result._id,
        product: result.product,
        quantity: result.quantity,
        request: {
          type: "GET",
          description: "Too see the order placed",
          url: `http://localhost:8000/orders/${result._id}`,
        },
      },
      orderedBy: {
        user: req.userData.email,
        userId: req.userData.userId,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};

exports.getParticularOrder = async (req, res, next) => {
  const id = req.params.orderId;
  try {
    const result = await Order.findById(id)
      .select("quantity product _id")
      .populate("product");
    if (result) {
      res.status(200).json({
        status: "Success",
        message: `Order with orderId ${id} found successfully`,
        product: result,
        request: {
          type: "GET",
          description: "To Get All Orders list",
          url: "http://localhost:8000/orders/",
        },
      });
    } else {
      res.status(404).json({
        status: "404 Error",
        message: `No Valid Entry found with orderId ${id}`,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};

exports.deleteOrder = async (req, res, next) => {
  const id = req.params.orderId;
  try {
    const result = await Order.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({
        status: "Success",
        message: `Order with orderId ${id} Cancelled successfully`,
        product: result,
        orderCanceledBy: {
          user: req.userData.email,
          userId: req.userData.userId,
        },
        request: {
          type: "POST",
          description: "To Place a new order",
          url: `http://localhost:8000/order`,
          body: {
            productId: "Schema.Types.ObjectId",
            quantity: "Number",
          },
        },
      });
    } else {
      res.status(404).json({
        status: "404 Error",
        message: `No Valid Entry found with orderId ${id} to cancel`,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};
