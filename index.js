const app = require("./app");
const sockets = require("./sockets");
const { createServer } = require("http");

global.games = {};

const server = createServer(app);

sockets.init(server);
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${server.address().port}`);
});
