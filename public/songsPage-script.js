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
  if (my.isOwner) document.querySelector("#start-game").disabled = false;
  renderPlayers();
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
  socket.emit("updateSongList", songList);
}

socket.on("updatedSongList", (updatedSongLinks) => {
  room.updatedSongLinks = updatedSongLinks.sort();
  document.querySelector("#entered-song-list").innerHTML = updatedSongLinks
    .sort()
    .map(
      (songLink) => `<p class="bg-primary rounded w-auto p-10">${songLink}</p>`
    )
    .join("");
});

function startGame() {
  if (playerList.length * room.numberOfSongs !== room.updatedSongLinks.length) {
    toastTopAlert(
      "Insufficient Songs",
      "Please ask everyone to submit their songs.",
      "alert-danger"
    );
    return;
  }
}
