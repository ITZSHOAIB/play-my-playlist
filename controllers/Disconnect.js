const { getPlayersCount } = require("./helpers");

class Disconnect {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  onDisconnect() {
    const { io, socket } = this;
    const { roomID } = socket;
    if (games[roomID]) {
      console.log(
        "🚀 ~ file: Disconnect.js:10 ~ Disconnect ~ onDisconnect ~ ",
        getPlayersCount(roomID),
        games[roomID].isStarted,
        games[roomID][socket.id].isOwner
      );
      if (
        (getPlayersCount(roomID) < 3 && games[roomID].isStarted) ||
        (!games[roomID].isStarted && getPlayersCount(roomID) < 2) ||
        games[roomID][socket.id].isOwner
      ) {
        socket.to(socket.roomID).emit("roomClosed");
        delete games[roomID];
        return;
      } else if (Number.isInteger(games[roomID][socket.id].score)) {
        games[roomID].voting = Object.fromEntries(
          Object.entries(games[roomID].voting).filter(
            ([key, value]) => key !== socket.id && value !== socket.id
          )
        );
        games[roomID].songList = games[roomID].songList.filter(
          (song) => song.owner !== socket.id
        );
        delete games[roomID][socket.id];
      }
    }
    if (socket.player) {
      socket.player.id = socket.id;
      socket.to(socket.roomID).emit("disconnection", socket.player);
    }
  }
}

module.exports = Disconnect;
