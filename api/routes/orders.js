const express = require("express");
const {
  getAllOrder,
  placeOrder,
  getParticularOrder,
  deleteOrder,
} = require("../controllers/orders");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.get("/", checkAuth, getAllOrder);

router.post("/", checkAuth, placeOrder);

router.get("/:orderId", checkAuth, getParticularOrder);

router.delete("/:orderId", checkAuth, deleteOrder);

module.exports = router;
