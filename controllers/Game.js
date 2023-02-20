const { GAME_STATE } = require("../constants");
const { randomIntFromInterval } = require("./helpers");

class Game {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  async startGame() {
    const { io, socket } = this;
    games[socket.data.roomID].gameState = GAME_STATE.gamePage;
    socket.to(socket.data.roomID).emit("startGame");
  }

  nextRound() {
    const { io, socket } = this;
    games[socket.data.roomID].gameState = GAME_STATE.gamePage;
    games[socket.data.roomID].currentSong = null;
    games[socket.data.roomID].voting = {};
    const randomIndex = randomIntFromInterval(
      0,
      games[socket.data.roomID].songList.length - 1
    );
    games[socket.data.roomID].currentSong = games[
      socket.data.roomID
    ].songList.splice(randomIndex, 1)[0];

    io.in(socket.data.roomID).emit("nextRound", {
      song: games[socket.data.roomID].currentSong.link,
      songsLeft: games[socket.data.roomID].songList.length,
    });
  }

  revealSongOwner() {
    const { io, socket } = this;
    const { owner } = games[socket.data.roomID].currentSong;
    const correctVoting = Object.fromEntries(
      Object.entries(games[socket.data.roomID].voting).filter(
        ([ownId, votedId]) => votedId === owner
      )
    );
    // no one guessed it correctly, so owner will get 10 points
    if (Object.entries(correctVoting).length === 0)
      games[socket.data.roomID]["players"][owner].score += 10;
    // If one guessed it correctly, so guesser will get 10 points
    else if (Object.entries(correctVoting).length === 1) {
      games[socket.data.roomID]["players"][
        Object.keys(correctVoting)[0]
      ].score += 10;
    }
    // If Anyone guessed it right, will get 5 points
    else
      Object.keys(correctVoting).forEach((playerId) => {
        games[socket.data.roomID]["players"][playerId].score += 5;
      });

    io.in(socket.data.roomID).emit("revealSongOwner", {
      ownerId: owner,
      ownerName: games[socket.data.roomID]["players"][owner].name,
    });
    io.in(socket.data.roomID).emit("updatedPlayers", {
      players: games[socket.data.roomID]["players"],
    });
  }

  casteVote(votedId) {
    const { io, socket } = this;
    games[socket.data.roomID]["voting"][socket.id] = votedId;
    io.in(socket.data.roomID).emit(
      "updatedVotes",
      games[socket.data.roomID]["voting"]
    );
  }

  getUpdatedVotes() {
    const { io, socket } = this;
    if (games[socket.data.roomID])
      io.in(socket.data.roomID).emit(
        "updatedVotes",
        games[socket.data.roomID]["voting"]
      );
  }
}

module.exports = Game;
