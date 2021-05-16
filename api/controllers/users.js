const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// This library is used to hash our password and then store it to database for maintaining security level so that if anyone get access to our database then also he cannot get the password directly. because it is encrypted format.

exports.signUpUser = async (req, res, next) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user.length > 0) {
      res.status(409).json({
        status: "Conflict",
        message: "User already exists Please Sign IN",
      });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        try {
          if (err) throw err;
          else {
            const newUser = new User({
              email: req.body.email,
              password: hash,
            });
            const result = await newUser.save();
            res.status(201).json({
              status: "Success",
              message: "User Registered SuccessFully",
            });
          }
        } catch (err) {
          res.status(500).json({
            status: "Failed",
            message: err.message,
          });
        }
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};

exports.logInUser = async (req, res, next) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user.length < 1) {
      res.status(404).json({
        status: "Failed",
        message: "Auth Failed!",
        // here we are not specifying the correct error message because if we tell the correct error message i.e email not exist then attacker can try brute force attacker and prepare a list of validate email addresses and then crack the password. so this is not a major flaw but not a minor flaw also.
      });
    } else {
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            status: "Failed",
            message: "Auth Failed!",
          });
        }
        // result contains the comparison of our plain text password with hash password which is store in our database.
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            status: "Success",
            message: "Auth Successful :)",
            token: token,
          });
        }
        res.status(401).json({
          status: "Failed",
          message: "Auth Failed!",
        });
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const result = await User.deleteOne({ _id: req.params.userId });
    res.status(200).json({
      status: "Success",
      message: "User Deleted SuccessFully",
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};
