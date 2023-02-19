const { nanoid } = require("nanoid");

class Room {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  //   songList = [
  //     {
  //       owner: "",
  //       link: "",
  //     },
  //   ];

  createPrivateRoom(player) {
    const { socket } = this;
    const id = nanoid(15);
    games[id] = {
      numberOfSongs: 3,
      isStarted: false,
      songList: [],
      currentSong: null,
      voting: {},
    };
    games[id][socket.id] = {};
    games[id][socket.id].score = 0;
    games[id][socket.id].name = player.pmpname;
    games[id][socket.id].isOwner = player.isOwner;
    socket.player = player;
    socket.roomID = id;
    socket.join(id);
    socket.emit("newPrivateRoom", { gameID: id });
  }
  async joinRoom(data) {
    const { io, socket } = this;
    const roomID = data.id;
    const players = Array.from(await io.in(roomID).allSockets());
    games[roomID][socket.id] = {};
    games[roomID][socket.id].score = 0;
    games[roomID][socket.id].name = data.player.pmpname;
    games[roomID][socket.id].isOwner = data.player.isOwner;
    socket.player = data.player;
    socket.join(roomID);
    socket.roomID = roomID;
    socket.to(roomID).emit("joinRoom", data.player);
    io.to(socket.id).emit("otherPlayers", {
      players: players.reduce((acc, id) => {
        if (socket.id !== id) {
          const { player } = io.of("/").sockets.get(id);
          acc.push(player);
        }
        return acc;
      }, []),
      isStarted: games[roomID].isStarted,
      numberOfSongs: games[roomID].numberOfSongs,
    });
  }

  updateSettings(data) {
    const { socket } = this;
    games[socket.roomID].numberOfSongs = +data.numberOfSongs;
    socket.to(socket.roomID).emit("settingsUpdate", data);
  }

  moveToSongsPage() {
    const { socket } = this;
    games[socket.roomID].isStarted = true;
    socket.to(socket.roomID).emit("moveToSongsPage", {
      numberOfSongs: games[socket.roomID].numberOfSongs,
    });
  }

  updateSongList(songList) {
    const { io, socket } = this;
    games[socket.roomID].songList = games[socket.roomID].songList.filter(
      (song) => song.owner !== socket.id
    );
    games[socket.roomID].songList = [
      ...games[socket.roomID].songList,
      ...songList.map((songLink) => {
        return {
          owner: socket.id,
          link: songLink,
        };
      }),
    ];
    io.in(socket.roomID).emit(
      "updatedSongList",
      games[socket.roomID].songList.map((song) => song.link)
    );
  }

  roomExists(data) {
    const { io, socket } = this;
    let exist = false;
    if (games[data.id] || games[socket.roomID]) {
      exist = true;
    }
    io.to(socket.id).emit("roomExists", { exist });
  }

  isRoomStarted(data) {
    const { io, socket } = this;
    let isStarted = false;
    if (games[data.id] || games[socket.roomID]) {
      isStarted = games[data.id].isStarted;
    }
    io.to(socket.id).emit("isRoomStarted", { isStarted });
  }
}

module.exports = Room;
