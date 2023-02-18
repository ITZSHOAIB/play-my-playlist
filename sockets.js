const socketio = require("socket.io");

const Room = require("./controllers/Rooms");
const Disconnect = require("./controllers/Disconnect");
const Game = require("./controllers/Game");

module.exports.init = (server) => {
  const io = socketio(server);
  io.on("connection", (socket) => {
    console.log("connected user " + socket.id);
    socket.on("roomExists", (data) => new Room(io, socket).roomExists(data));
    socket.on("isRoomStarted", (data) =>
      new Room(io, socket).isRoomStarted(data)
    );
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
    socket.on("updateSongList", (data) =>
      new Room(io, socket).updateSongList(data)
    );
    socket.on("disconnect", () => new Disconnect(io, socket).onDisconnect());
    socket.on("startGame", async () => {
      await new Game(io, socket).startGame();
    });
    socket.on("nextRound", () => {
      new Game(io, socket).nextRound();
    });
    socket.on("revealSongOwner", () => {
      new Game(io, socket).revealSongOwner();
    });
    socket.on("casteVote", (data) => {
      new Game(io, socket).casteVote(data);
    });
    socket.on("getUpdatedVotes", () => {
      new Game(io, socket).getUpdatedVotes();
    });
  });
};
