const socket = io();
const my = {
  id: null,
  pmpname: null,
  isOwner: false,
};
let playerList = [];
const room = {
  roomId: null,
  numberOfSongs: null,
  updatedSongLinks: [],
};

/************************************************
 ***Common Section--------------------
 *************************************************/
function renderPlayers() {
  document.querySelector("#settings-players").innerHTML = playerList
    .map(
      (player) =>
        `<p class="bg-danger rounded w-auto p-10" id="player-${player.id}">${
          player.pmpname
        } ${player.isOwner ? "(Host)" : ""}</p>`
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

/************************************************
 ***Common Socket Listeners--------------------
 *************************************************/
// Socket on disconnect
socket.on("disconnection", async (player) => {
  playerList = playerList.filter(
    (playerDetails) => playerDetails.id !== player.id
  );
  renderPlayers();
  if (document.querySelector(`#score-player-${player.id}`)) {
    document.querySelector(`#score-player-${player.id}`).remove();
  }
  toastTopAlert(
    `${player.pmpname} has Left The Room`,
    "He/She doesn't like you 😢 It's okay, you are precious ❤️",
    "alert-secondary"
  );
  socket.emit("roomExists", { id: room.roomId });
  socket.on("roomExists", (data) => {
    if (!data.exist && !document.querySelector("#settings")) {
      toastTopAlert(
        `Room closed because of Less Participants`,
        "Again gather all your buddies 😢 Believe me It will be fun ❤️",
        "alert-danger"
      );
      window.setTimeout(function () {
        window.location.href = "/";
      }, 3000);
    }
  });
});

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
