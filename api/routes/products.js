const express = require("express");
const multer = require("multer");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const {
  getAllProducts,
  addProduct,
  getParticularProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

//# Multer Configuration to parse File Uploads
const storage = multer.diskStorage({
  // Multer Will execute this function whenever a new file is received.
  // This tells where to store the file.
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // if you want to store the file by original name:
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else cb(null, false);
};
//- Initiating Function and providing additional config for file uploading which we define in the above storage function.
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

//# GET All Products
router.get("/", getAllProducts);

//# POST a Product
router.post("/", checkAuth, upload.single("productImage"), addProduct);

//# GET the product with the specified productID
router.get("/:productId", getParticularProduct);

router.patch("/:productId", checkAuth, updateProduct);

//# Delete the product with productId
router.delete("/:productId", checkAuth, deleteProduct);

module.exports = router;
