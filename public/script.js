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
  voting: {},
};

/************************************************
 ***Common Section--------------------
 *************************************************/
function renderPlayers() {
  if (document.querySelector("#settings-players"))
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
  if (document.querySelector("#game-page").classList.contains("d-flex")) {
    socket.emit("getUpdatedVotes");
    renderVotingSection();
  }

  if (document.querySelector(`#score-player-${player.id}`)) {
    //
    document.querySelector(`#score-player-${player.id}`).remove();
  }
  toastTopAlert(
    `${player.pmpname} has Left The Room`,
    "He/She doesn't like you 😢 It's okay, you are precious ❤️",
    "alert-secondary"
  );
  socket.emit("roomExists", { id: room.roomId });
});

socket.on("roomExists", (data) => {
  if (!data.exist) {
    if (document.querySelector("#join-room"))
      document.querySelector("#join-room").disabled = true;
    toastTopAlert(
      "Room doesn't exist or host left",
      "Room you are trying to access is not created, please create a new Room.",
      "alert-danger"
    );
    window.setTimeout(function () {
      window.location.href = "/";
    }, 3000);
  }
});

socket.on("isRoomStarted", (data) => {
  if (data.isStarted) {
    if (document.querySelector("#join-room"))
      document.querySelector("#join-room").disabled = true;
    toastTopAlert(
      "Room already started",
      "Room you are trying to access is already started playing...",
      "alert-danger"
    );
    window.setTimeout(function () {
      window.location.href = "/";
    }, 3000);
  }
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
