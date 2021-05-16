const mongoose = require("mongoose");

const dbUserName = process.env.DB_USER_NAME;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;
const connectionString = `mongodb+srv://${dbUserName}:${dbPass}@node-rest-database.wvabs.mongodb.net/${dbName}?retryWrites=true&w=majority`;

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => {
        console.log("MongoDb Atlas Connection SuccessFull");
      })
      .catch((err) => {
        console.log(`MongoDb Atlas Connection Error-${err.message}`);
      });
  }
}

module.exports = new Database();

