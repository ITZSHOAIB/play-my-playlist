const GAME_STATE = {
  settingsPage: "SETTINGS_PAGE",
  songsPage: "SONGS_PAGE",
  gamePage: "GAME_PAGE",
};
const socket = io({
  // reconnectionDelay: 10000, // defaults to 1000
  // reconnectionDelayMax: 10000, // defaults to 5000
});
const my = {
  id: null,
  name: null,
  isHost: false,
};
const room = {
  roomId: null,
  numberOfSongs: null,
  updatedSongLinks: [],
  voting: {},
  players: {},
  songsLeft: 0,
};

// socket.on("connect", () => {
//   console.log("recovered?", socket.recovered);

//   setTimeout(() => {
//     if (socket.io.engine) {
//       // close the low-level connection and trigger a reconnection
//       console.log("Closing connection...");
//       socket.io.engine.close();
//     }
//   }, 10000);
// });
/************************************************
 ***Common Section--------------------
 *************************************************/

function IsLandingPage() {
  return (
    document.querySelector("#landing") &&
    document.querySelector("#landing").classList.contains("d-flex")
  );
}
function isSettingsPage() {
  return (
    document.querySelector("#settings") &&
    document.querySelector("#settings").classList.contains("d-flex")
  );
}
function isSongsPage() {
  return (
    document.querySelector("#songs-page") &&
    document.querySelector("#songs-page").classList.contains("d-flex")
  );
}
function isGamePage() {
  return (
    document.querySelector("#game-page") &&
    document.querySelector("#game-page").classList.contains("d-flex")
  );
}

function makeLoaderVisible(visible) {
  console.log(visible);
  if (visible)
    document.querySelector(".spinner-container").style.display = "flex";
  else document.querySelector(".spinner-container").style.display = "none";
}

function renderPlayers() {
  if (document.querySelector("#settings-players"))
    document.querySelector("#settings-players").innerHTML = playerList
      .map(
        (player) =>
          `<p class="bg-danger rounded w-auto p-10" id="player-${player.id}">${
            player.name
          } ${player.isHost ? "(Host)" : ""}</p>`
      )
      .join("");
}

function updateCopyInvite() {
  const copyInvite = document.querySelector("#copy-link");
  if (!copyInvite) return;
  copyInvite.value = `${window.location.protocol}//${window.location.host}/?id=${room.roomId}`;
  copyInvite.addEventListener("click", (e) => {
    e.preventDefault();
    toastTopAlert(
      "Link Copied Successfully",
      "Now share the copied link and ask your friends to join (If you have any 😜)",
      "alert-success"
    );
    copyInvite.select();
    document.execCommand("copy");
  });
}

function reloadToMainPageIfRoomClosed() {
  makeLoaderVisible(true);
  toastTopAlert(
    "Room doesn't exist or host left",
    "Room you are trying to access is not created, please create a new Room.",
    "alert-danger"
  );
  window.setTimeout(function () {
    makeLoaderVisible(false);
    window.location.href = "/";
  }, 3000);
}

/************************************************
 ***Common Socket Listeners--------------------
 *************************************************/
// Socket on disconnect
socket.on("disconnection", async (player) => {
  playerList = playerList.filter(
    (playerDetails) => playerDetails.id !== player.id
  );
  renderPlayers();
  if (document.querySelector("#game-page").classList.contains("d-flex")) {
    socket.emit("getUpdatedVotes");
    renderVotingSection();
  }
  if (document.querySelector(`#score-player-${player.id}`)) {
    document.querySelector(`#score-player-${player.id}`).remove();
  }
  toastTopAlert(
    `${player.name} has Left The Room`,
    "He/She doesn't like you 😢 It's okay, you are precious ❤️",
    "alert-secondary"
  );
  socket.emit("roomExists", { id: room.roomId });
});

socket.on("roomExists", (data) => {
  if (!data.exist) {
    if (document.querySelector("#join-room"))
      document.querySelector("#join-room").disabled = true;
    reloadToMainPageIfRoomClosed();
  }
});

//This will happen when we will not have enought player or Host left
socket.on("roomClosed", reloadToMainPageIfRoomClosed);

/************************************************
 ***Alert Section--------------------
 *************************************************/

// Toasts Top alert
function toastTopAlert(title, content, alertType) {
  halfmoon.initStickyAlert({
    content: content,
    title: title,
    alertType: alertType,
    fillType: "filled-lm",
    timeShown: 10000,
  });
}
