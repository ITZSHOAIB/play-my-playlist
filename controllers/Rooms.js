const { nanoid } = require("nanoid");
const { GAME_STATE } = require("../constants");

class Room {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  createPrivateRoom(player) {
    const { io, socket } = this;
    const id = nanoid(15);
    games[id] = {
      players: {},
      numberOfSongs: 3,
      songList: [],
      currentSong: null,
      voting: {},
      gameState: GAME_STATE.settingsPage,
    };
    games[id]["players"][socket.id] = {
      score: 0,
      name: player.name,
      isHost: player.isHost,
    };
    socket.data.player = player;
    socket.data.roomID = id;
    socket.join(id);
    io.to(socket.id).emit("newPrivateRoom", { gameID: id });
    io.in(socket.data.roomID).emit("updatedPlayers", {
      players: games[socket.data.roomID]["players"],
    });
  }
  joinRoom(data) {
    const { io, socket } = this;
    const roomID = data.id;
    games[roomID]["players"][socket.id] = {
      score: 0,
      name: data.player.name,
      isHost: data.player.isHost,
    };
    socket.data.player = data.player;
    socket.join(roomID);
    socket.data.roomID = roomID;
    io.in(socket.data.roomID).emit("updatedPlayers", {
      players: games[socket.data.roomID]["players"],
    });
    if (games[socket.data.roomID].gameState === GAME_STATE.songsPage) {
      io.to(socket.id).emit("moveToSongsPage", {
        numberOfSongs: games[socket.data.roomID].numberOfSongs,
      });
    }
  }

  updateSettings(data) {
    const { socket } = this;
    games[socket.data.roomID].numberOfSongs = +data.numberOfSongs;
    socket.to(socket.data.roomID).emit("settingsUpdate", data);
  }

  moveToSongsPage() {
    const { socket } = this;
    games[socket.data.roomID].gameState = GAME_STATE.songsPage;
    socket.to(socket.data.roomID).emit("moveToSongsPage", {
      numberOfSongs: games[socket.data.roomID].numberOfSongs,
    });
  }

  getUpdatedPlayers() {
    const { io, socket } = this;
    io.to(socket.id).emit("updatedPlayers", {
      players: games[socket.data.roomID]["players"],
    });
  }

  updateSongList(songList) {
    const { io, socket } = this;
    games[socket.data.roomID].songList = games[
      socket.data.roomID
    ].songList.filter((song) => song.owner !== socket.id);
    games[socket.data.roomID].songList = [
      ...games[socket.data.roomID].songList,
      ...songList.map((songLink) => {
        return {
          owner: socket.id,
          link: songLink,
        };
      }),
    ];
    io.in(socket.data.roomID).emit(
      "updatedSongList",
      games[socket.data.roomID].songList.map((song) => song.link)
    );
  }

  roomExists(data) {
    const { io, socket } = this;
    let exist = false;
    if (games[data.id] || games[socket.data.roomID]) {
      exist = true;
    }
    io.to(socket.id).emit("roomExists", { exist });
  }

  getGameState(data) {
    const { io, socket } = this;
    io.to(socket.id).emit("getGameState", {
      gameState: games[data.id].gameState,
    });
  }
}

module.exports = Room;
