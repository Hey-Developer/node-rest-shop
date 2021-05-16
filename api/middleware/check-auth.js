const jwt = require("jsonwebtoken");

// Default middleware Syntax in express.js
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY, null);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth Failed",
    });
  }
};

//# You have to put this middleware after the upload middleware because here we use req.body hence to parse the request body first we required that upload middleware which parses our body as well as the form data.
//-> Now this is one way you can do that is to send the token with the request body..
//Or You can use another way which is to send the token using Authorization headers.
//# There is a Authorization header available which u can use to send the aut info such as the token.
// To pass the Value in the authorization header u have to use a syntax that is:
//> Bearer TOKEN_KEY
// This is common conversation used with the auth header the "bearer" term is used to denote that this authorization bears a token.
