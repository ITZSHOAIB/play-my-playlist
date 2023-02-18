const app = require("./app");
const sockets = require("./sockets");

global.games = {};

const server = app.listen(process.env.PORT || 3000, process.env.IP, () => {
  console.log(`Server listening on port ${server.address().port}`);
});

sockets.init(server);
