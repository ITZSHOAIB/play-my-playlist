const { getPlayersCount } = require("./helpers");

class Disconnect {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  onDisconnect() {
    const { io, socket } = this;
    if (games[socket.data.roomID])
      console.log(
        "🚀 ~ file: Disconnect.js:10 ~ Disconnect ~ onDisconnect ~ ",
        getPlayersCount(socket.data.roomID),
        games[socket.data.roomID]["players"][socket.id].isHost,
        socket.recovered
      );
    // if (games[socket.data.roomID]) {
    //   console.log(
    //     "🚀 ~ file: Disconnect.js:10 ~ Disconnect ~ onDisconnect ~ ",
    //     getPlayersCount(socket.data.roomID),
    //     games[socket.data.roomID].isStarted,
    //     games[socket.data.roomID]["players"][socket.id].isHost
    //   );
    //   if (
    //     (getPlayersCount(socket.data.roomID) < 3 && games[socket.data.roomID].isStarted) ||
    //     (!games[socket.data.roomID].isStarted && getPlayersCount(socket.data.roomID) < 2) ||
    //     games[socket.data.roomID]["players"][socket.id].isHost
    //   ) {
    //     socket.to(socket.data.roomID).emit("roomClosed");
    //     delete games[socket.data.roomID];
    //     return;
    //   } else if (Number.isInteger(games[socket.data.roomID]["players"][socket.id].score)) {
    //     games[socket.data.roomID].voting = Object.fromEntries(
    //       Object.entries(games[socket.data.roomID].voting).filter(
    //         ([key, value]) => key !== socket.id && value !== socket.id
    //       )
    //     );
    //     games[socket.data.roomID].songList = games[socket.data.roomID].songList.filter(
    //       (song) => song.owner !== socket.id
    //     );
    //     delete games[socket.data.roomID]["players"][socket.id];
    //   }
    // }
    // if (socket.data.player) {
    //   socket.data.player.id = socket.id;
    //   socket.to(socket.data.roomID).emit("disconnection", socket.data.player);
    // }
  }
}

module.exports = Disconnect;
