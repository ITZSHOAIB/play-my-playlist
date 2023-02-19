const { randomIntFromInterval } = require("./helpers");

class Game {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  async startGame() {
    const { io, socket } = this;
    socket.to(socket.roomID).emit("startGame");
  }

  nextRound() {
    const { io, socket } = this;
    games[socket.roomID].currentSong = null;
    games[socket.roomID].voting = {};
    const randomIndex = randomIntFromInterval(
      0,
      games[socket.roomID].songList.length - 1
    );
    games[socket.roomID].currentSong = games[socket.roomID].songList.splice(
      randomIndex,
      1
    )[0];

    io.in(socket.roomID).emit("nextRound", {
      song: games[socket.roomID].currentSong.link,
      songsLeft: games[socket.roomID].songList.length,
    });
  }

  revealSongOwner() {
    const { io, socket } = this;
    const { owner } = games[socket.roomID].currentSong;
    const correctVoting = Object.fromEntries(
      Object.entries(games[socket.roomID].voting).filter(
        ([ownId, votedId]) => votedId === owner
      )
    );
    // no one guessed it correctly, so owner will get 10 points
    if (Object.entries(correctVoting).length === 0)
      games[socket.roomID][owner].score += 10;

    // If Anyone guessed it right, will get 5 points
    Object.keys(correctVoting).forEach((playerId) => {
      games[socket.roomID][playerId].score += 5;
    });

    const scoreboard = Object.entries(games[socket.roomID])
      .filter(([id, player]) => Number.isInteger(player.score))
      .map(([id, player]) => {
        return { ...player, id: id };
      });

    io.in(socket.roomID).emit("updatedScoreboard", scoreboard);
    io.in(socket.roomID).emit("revealSongOwner", {
      ownerId: owner,
      ownerName: games[socket.roomID][owner].name,
    });
  }

  casteVote(votedId) {
    const { io, socket } = this;
    games[socket.roomID]["voting"][socket.id] = votedId;
    io.in(socket.roomID).emit("updatedVotes", games[socket.roomID]["voting"]);
  }

  getUpdatedVotes() {
    const { io, socket } = this;
    if (games[socket.roomID])
      io.in(socket.roomID).emit("updatedVotes", games[socket.roomID]["voting"]);
  }
}

module.exports = Game;
