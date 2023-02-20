/************************************************
 ***Landing Page Code Section --------------------
 *************************************************/

window.onload = () => {
  if (localStorage.getItem("pmpname"))
    document.querySelector("#name-landing-input").value =
      localStorage.getItem("pmpname");
};

const searchParams = new URLSearchParams(window.location.search);

//new player or joinee
if (searchParams.has("id")) {
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
  room.roomId = searchParams.get("id");
  socket.emit("roomExists", { id: room.roomId });
  socket.emit("getGameState", { id: room.roomId });
} else {
  document.querySelector("#create-room").addEventListener("click", () => {
    if (landingToSettings()) settingsAsOwner();
  });
}
function landingToSettings() {
  if (document.querySelector("#name-landing-input").value.trim() === "") {
    toastTopAlert(
      "Missing Data :(",
      "Don't you have a name? Don't leave that box empty. Okay?",
      "alert-danger"
    );
    return false;
  }
  localStorage.setItem(
    "pmpname",
    document.querySelector("#name-landing-input").value.trim()
  );
  my.name = document.querySelector("#name-landing-input").value.trim();
  my.id = socket.id;
  document.querySelector("#landing").remove();
  document.querySelector("#settings").classList.remove("d-none");
  document.querySelector("#settings").classList.add("d-flex");
  return true;
}

socket.on("getGameState", ({ gameState }) => {
  if (
    gameState === GAME_STATE.settingsPage ||
    gameState === GAME_STATE.songsPage
  ) {
    document.querySelector("#join-room").disabled = false;
    document.querySelector("#join-room").addEventListener("click", () => {
      if (landingToSettings()) settingsAsPlayer();
    });
  }
});
