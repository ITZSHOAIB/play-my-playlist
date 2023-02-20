const { Server } = require("socket.io");

const Room = require("./controllers/Rooms");
const Disconnect = require("./controllers/Disconnect");
const Game = require("./controllers/Game");

module.exports.init = (server) => {
  const io = new Server(server, {
    connectionStateRecovery: {
      maxDisconnectionDuration: 5 * 60 * 1000,
    },
  });

  //Socket operations...
  io.on("connection", (socket) => {
    console.log("🚀 ~ connected user ~ socket.id", socket.id);
    if (socket.recovered) console.log("🚀 ~ Socker Recovered ~ ", socket.data);
    socket.on("roomExists", (data) => new Room(io, socket).roomExists(data));
    socket.on("getGameState", (data) =>
      new Room(io, socket).getGameState(data)
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
    socket.on("getUpdatedPlayers", () =>
      new Room(io, socket).getUpdatedPlayers()
    );
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
