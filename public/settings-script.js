/************************************************
 ***Settings Page Code Section --------------------
 *************************************************/

//Settings page as other Player--
function settingsAsPlayer() {
  document.querySelector("#no-of-songs").setAttribute("disabled", true);
  document.querySelector("#move-songs-page").setAttribute("disabled", true);
  my.id = socket.id;
  socket.emit("joinRoom", { id: room.roomId, player: my });
  updateCopyInvite();
  putPlayer(my);
}

//Settings page as Room Owner--
function settingsAsOwner() {
  document
    .querySelector("#no-of-songs")
    .addEventListener("change", updateSettings);
  my.id = socket.id;
  my.isOwner = true;
  socket.emit("newPrivateRoom", my);
  socket.on("newPrivateRoom", (data) => {
    room.roomId = data.gameID;
    updateCopyInvite();
    putPlayer(my);
  });
}
//get rest of the players
socket.on("joinRoom", putPlayer);
socket.on("otherPlayers", ({ players, isStarted, numberOfSongs }) => {
  if (isStarted) insertSongspage(numberOfSongs);
  players.forEach((player) => putPlayer(player));
});

//put players in the UI
function putPlayer(player) {
  playerList = playerList.filter(
    (playerDetails) => playerDetails.id !== player.id
  );
  playerList.push(player);
  renderPlayers();
  if (player.id != my.id) {
    toastTopAlert(
      `${player.pmpname} has Joined The Room`,
      "So, you have friends hah? Great... ❤️",
      "alert-success"
    );
  }
}

function updateSettings() {
  const numberOfSongs = +document.querySelector("#no-of-songs").value;
  room.numberOfSongs = numberOfSongs;
  socket.emit("settingsUpdate", {
    numberOfSongs,
  });
}

socket.on("settingsUpdate", (data) => {
  room.numberOfSongs = data.numberOfSongs;
  document.querySelector("#no-of-songs").value = data.numberOfSongs;
});

socket.on("moveToSongsPage", (data) => {
  insertSongspage(data.numberOfSongs);
});

// move to Songs page:
document.querySelector("#move-songs-page").addEventListener("click", (e) => {
  if (playerList.length < 2) {
    toastTopAlert(
      "Only 1 participant, minimum 3 required",
      "Please invite your friends. Don't you have any friends? Oww 🥺",
      "alert-secondary"
    );
    return;
  }
  if (
    document.querySelector("#no-of-songs").value < 3 ||
    document.querySelector("#no-of-songs").value > 10
  ) {
    toastTopAlert(
      "Incorrect No of Songs value",
      "Please enter No of Songs value between (3-10)",
      "alert-danger"
    );
    return;
  }
  updateSettings();
  socket.emit("moveToSongsPage");
  insertSongspage(+document.querySelector("#no-of-songs").value);
});
