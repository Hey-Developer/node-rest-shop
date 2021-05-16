const http = require("http");
const app = require("./app");

// Server Configuration:
const port = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(port, "127.0.0.1", () => {
  console.log(`Node-Rest-Shop is listening on the http://localhost:${port}`);
});
