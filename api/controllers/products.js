const Product = require("../models/Products");

exports.getAllProducts = async (req, res, next) => {
  //note: we have to send a self-describing response to the client because it is the one of the constraints of the restful api's.
  try {
    const result = await Product.find().select("name price _id productImage");
    if (result.length > 0) {
      res.status(200).json({
        status: "Success",
        message: `Here is the list of all the products available`,
        count: result.length,
        products: result.map((product) => {
          return {
            name: product.name,
            price: product.price,
            id: product._id,
            productImage: product.productImage,
            request: {
              type: "GET",
              description: "To see the products details",
              url: "http://localhost:8000/products/" + product.id,
            },
          };
        }),
      });
    } else {
      res.status(200).json({
        status: "Success",
        count: result.length,
        message: `No Products Available, Please add some products`,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path,
    });
    const result = await newProduct.save();
    res.status(201).json({
      status: "Success",
      message: "New Product Added successfully",
      product: {
        id: result._id,
        name: result.name,
        price: result.price,
        productImage: result.productImage,
        request: {
          type: "GET",
          description: "Too see the new product added",
          url: `http://localhost:8000/products/${result._id}`,
        },
      },
      postedBy: {
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

exports.getParticularProduct = async (req, res, next) => {
  const id = req.params.productId;
  try {
    const result = await Product.findById(id).select(
      "name price _id productImage"
    );
    if (result) {
      res.status(200).json({
        status: "Success",
        message: `Product with productId ${id} found successfully`,
        product: result,
        request: {
          type: "GET",
          description: "To Get All Products",
          url: "http://localhost:8000/products/",
        },
      });
    } else {
      res.status(404).json({
        status: "404 Error",
        message: `No Valid Entry found with productId ${id}`,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  const id = req.params.productId;
  const updateProduct = {};
  try {
    for (const ops of req.body) {
      updateProduct[ops.propName] = ops.value;
    }
    /* 
      Now to above code to work you need to pass an array to the req.body with an object containing properties like propName and value.
      [
          {
              "propName":"name",
              "value": "Apple Iphone 12"
          }
      ]
      */
    const result = await Product.findByIdAndUpdate(id, updateProduct, {
      new: true,
    });
    if (result) {
      res.status(200).json({
        status: "Success",
        message: `Product with productId ${id} Updated successfully, you will get the updated product in result`,
        product: result,
        request: {
          type: "GET",
          description: "To GET the updated product details",
          url: `http://localhost:8000/products/${result._id}`,
        },
        updatedBy: {
          user: req.userData.email,
          userId: req.userData.userId,
        },
      });
    } else {
      res.status(404).json({
        status: "404 Error",
        message: `No Valid Entry found with productId ${id}`,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};

exports.deleteProduct = async (req, res, next) => {
  const id = req.params.productId;
  try {
    const result = await Product.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({
        status: "Success",
        message: `Product with productId ${id} Deleted successfully`,
        product: result,
        request: {
          type: "POST",
          description: "To Add a new product",
          url: `http://localhost:8000/products`,
          body: {
            name: "String",
            price: "Number",
          },
        },
        deletedBy: {
          user: req.userData.email,
          userId: req.userData.userId,
        },
      });
    } else {
      res.status(404).json({
        status: "404 Error",
        message: `No Valid Entry found with productId ${id} to delete`,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};
