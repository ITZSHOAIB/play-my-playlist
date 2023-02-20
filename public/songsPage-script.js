/************************************************
 ***Songs Page Code Section --------------------
 *************************************************/

function insertSongspage(numberOfSongs) {
  document.querySelector("#settings").remove();
  document.querySelector("#songs-page").classList.remove("d-none");
  document.querySelector("#songs-page").classList.add("d-flex");
  document.querySelector("#song-link-section").innerHTML = new Array(
    numberOfSongs
  )
    .fill(0)
    .map(
      (_) => `<div class="form-row">
    <input
      type="text"
      class="form-control form-control-lg song-link"
      placeholder="Enter your Song's link"
    />
  </div>`
    )
    .join("");
  if (my.isHost) document.querySelector("#start-game").disabled = false;
  socket.emit("getUpdatedPlayers");
  updateCopyInvite();
  document
    .querySelector("#update-song-list")
    .addEventListener("click", updateSongList);

  document.querySelector("#start-game").addEventListener("click", startGame);
}

function updateSongList() {
  const songLinkElementList = document.querySelectorAll(".song-link");
  const songList = [...songLinkElementList].map((songLinkEle) =>
    songLinkEle.value.trim()
  );

  if (
    songList.filter((song) => song !== null && song !== "").length !==
    songList.length
  ) {
    toastTopAlert(
      "Song list incomplete",
      "Please provide all the song links in every textbox.",
      "alert-danger"
    );
    return;
  }
  makeLoaderVisible(true);
  socket.emit("updateSongList", songList);
}

socket.on("updatedSongList", (updatedSongLinks) => {
  makeLoaderVisible(false);
  room.updatedSongLinks = updatedSongLinks.sort();
  document.querySelector("#entered-song-list").innerHTML = updatedSongLinks
    .sort()
    .map(
      (songLink) => `<p class="bg-primary rounded w-auto p-10">${songLink}</p>`
    )
    .join("");
});

function startGame() {
  if (
    Object.entries(room.players).length * room.numberOfSongs !==
    room.updatedSongLinks.length
  ) {
    toastTopAlert(
      "Insufficient Songs",
      "Please ask everyone to submit their songs.",
      "alert-danger"
    );
    return;
  }
  makeLoaderVisible(true);
  socket.emit("startGame");
  insertGamePage();
}

socket.on("startGame", () => {
  insertGamePage();
});
