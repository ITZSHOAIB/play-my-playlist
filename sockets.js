const socketio = require("socket.io");

const Room = require("./controllers/Rooms");
const Disconnect = require("./controllers/Disconnect");
// const Game = require('./controllers/Game');

module.exports.init = (server) => {
  const io = socketio(server);
  io.on("connection", (socket) => {
    console.log("connected user");
    socket.on("roomExists", (data) => new Room(io, socket).roomExists(data));
    socket.on("newPrivateRoom", (player) =>
      new Room(io, socket).createPrivateRoom(player)
    );
    socket.on("joinRoom", async (data) => {
      await new Room(io, socket).joinRoom(data);
    });
    socket.on("settingsUpdate", (data) =>
      new Room(io, socket).updateSettings(data)
    );
    socket.on("moveToSongsPage", () => new Room(io, socket).moveToSongsPage());
    socket.on("updateSongList", (data) => new Room(io, socket).updateSongList(data));
    socket.on("disconnect", () => new Disconnect(io, socket).onDisconnect());

    // socket.on('startGame', async () => { await new Game(io, socket).startGame(); });
    // socket.on('message', (data) => new Game(io, socket).onMessage(data));
    // socket.on('getPlayers', async () => { await new Game(io, socket).getPlayers(); });

    // socket.on('getCurrentDrawer', () => new Game(io, socket).getCurrentDrawer());

    // socket.on('broadcasterIsReady', () => new Game(io, socket).broadcasterIsReady());
    // socket.on('watcher', () => new Game(io, socket).watcher());
    // socket.on('offer', (id, offerMessage) => new Game(io, socket).offer(id, offerMessage));
    // socket.on('answer', (id, ansMessage) => new Game(io, socket).answer(id, ansMessage));
    // socket.on('candidate', (id, candidateMessage) => new Game(io, socket).candidate(id, candidateMessage));
  });
};
