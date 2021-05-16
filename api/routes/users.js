const express = require("express");
const { signUpUser, logInUser, deleteUser } = require("../controllers/users");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/signup", signUpUser);

router.post("/login", logInUser);

router.delete("/:userId", checkAuth, deleteUser);

module.exports = router;
