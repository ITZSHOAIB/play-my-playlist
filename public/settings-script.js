/************************************************
 ***Settings Page Code Section --------------------
 *************************************************/

//Settings page as Room Owner--
function settingsAsOwner() {
  document
    .querySelector("#no-of-songs")
    .addEventListener("change", updateSettings);
  my.id = socket.id;
  my.isHost = true;
  makeLoaderVisible(true);
  socket.emit("newPrivateRoom", my);
}
socket.on("newPrivateRoom", (data) => {
  makeLoaderVisible(false);
  room.roomId = data.gameID;
  updateCopyInvite();
});

//Settings page as other Player--
function settingsAsPlayer() {
  document.querySelector("#no-of-songs").setAttribute("disabled", true);
  document.querySelector("#move-songs-page").setAttribute("disabled", true);
  socket.emit("joinRoom", { id: room.roomId, player: my });
  updateCopyInvite();
}

//Update players

socket.on("updatedPlayers", (data) => {
  const { players } = data;
  room.players = players;
  console.log(players);
  if (isSettingsPage() || isSongsPage()) {
    renderPlayersOnSettingsPage();
  }
  if (isGamePage()) {
    renderScoreboard();
    renderVotingSection();
  }
});

//put players in the UI
function renderPlayersOnSettingsPage() {
  if (document.querySelector("#settings-players"))
    document.querySelector("#settings-players").innerHTML = Object.entries(
      room.players
    )
      .map(
        ([id, playerDetails]) =>
          `<p class="bg-danger rounded w-auto p-10" id="player-${id}">${
            playerDetails.name
          } ${playerDetails.isHost ? "(Host)" : ""}</p>`
      )
      .join("");
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
  if (isSettingsPage()) {
    document.querySelector("#no-of-songs").value = data.numberOfSongs;
  }
});

// move to Songs page:
document.querySelector("#move-songs-page").addEventListener("click", (e) => {
  if (!my.isHost) return;
  if (Object.entries(room.players).length < 2) {
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

socket.on("moveToSongsPage", (data) => {
  insertSongspage(data.numberOfSongs);
});
