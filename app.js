//# Importing Dependencies...
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");

//# Connecting TO DataBase..
// now we will connect to MongoDB Atlas Database we already setup the database at cloud using atlas, just require the database file as we already write the connection code there..
require("./api/Database");

//# App Configuration...
const app = express();
const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");
const usersRoutes = require("./api/routes/users");

const uploads_path = path.join(__dirname, "./uploads");
app.use("/uploads", express.static(uploads_path));

//# Writing Middleware...
//> In This MiddleWare we will send the headers to the client Browser in response to every request...
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    // Browser will only send the OPTIONS request first if you send a POST request or a PUT request
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH DELETE");
    return res.status(200).json({});
  }
  // Now currently we are just blocking the other routes so we have to call next() function so that flow go on the other middleware and handle the other routes as here we just send http headers in response and not any valid data..
  next();
});

//? here is package named Morgan which help us to log all the request on our server these will be beneficial if we want to log every request that makes on our server.. just install it from npm: npm i morgan
// To use morgan simple tell express to use morgan as a middleware function..
app.use(morgan("dev"));

//? Now we will use bodyParser as middleware which will allow us to parse the incoming data from the client side such as in post request..
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// A Middleware fucntion that will call on each request on the server..
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/user", usersRoutes);

//* Error Handling, Now if the code reaches this line means all above routes are not found in the url this means url contain something else which we didn't defined above hence we have to return a error json in all those request which are not defined above..

app.use((req, res, next) => {
  // This middleware will accept every request..
  const error = new Error("Request URL does not exist..");
  error.status = 404;
  next(error);
});

//Now we passed error from the previous middleware and we will send that error in this middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

//# Exporting the App Function..
module.exports = app;
