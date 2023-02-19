/************************************************
 ***Songs Page Code Section --------------------
 *************************************************/

function insertGamePage() {
  makeLoaderVisible(false);
  renderGamePage();
  if (my.isOwner) {
    socket.emit("nextRound");
    document.querySelector("#reveal-song-owner").disabled = false;

    document.querySelector("#next-round").addEventListener("click", () => {
      makeLoaderVisible(true);
      socket.emit("nextRound");
    });

    document
      .querySelector("#reveal-song-owner")
      .addEventListener("click", revealSongOwner);
  }

  document.querySelector("#copy-current-song").addEventListener("click", () => {
    document.querySelector("#current-song-link").select();
    document.execCommand("copy");
  });

  renderOtherPlayersVotes(
    Object.fromEntries(playerList.map((player) => [player.id, null]))
  );
  renderScoreboard(
    playerList.map((player) => {
      return { ...player, score: 0, name: player.pmpname };
    })
  );
  renderVotingSection();
  document.querySelector("#caste-vote").addEventListener("click", casteVote);
}

function renderGamePage() {
  if (document.querySelector("#songs-page"))
    document.querySelector("#songs-page").remove();

  if (document.querySelector("#game-page").classList.contains("d-none")) {
    document.querySelector("#game-page").classList.remove("d-none");
    document.querySelector("#game-page").classList.add("d-flex");
  }
}

function renderOtherPlayersVotes(votingList) {
  document.querySelector("#other-players-votes").innerHTML = Object.entries(
    votingList
  )
    .map(
      ([player, votedPlayer]) =>
        `<p class="${
          votedPlayer
            ? `bg-secondary text-dark voted-to-${votedPlayer}`
            : "bg-danger"
        } rounded w-auto p-10" id="player-voted-${player}">
    ${
      playerList.filter((playerDetails) => playerDetails.id === player)[0]
        .pmpname
    } - ${
          votedPlayer
            ? playerList.filter(
                (playerDetails) => playerDetails.id === votedPlayer
              )[0].pmpname
            : "none"
        }
  </p>`
    )
    .join("");
}

function renderVotingSection() {
  // voting-section
  document.querySelector("#voting-section").innerHTML = playerList
    .filter((player) => player.id !== my.id)
    .map(
      (player) => `<div class="custom-radio m-15">
    <input
      type="radio"
      name="voting-radio"
      id="player-vote-id-${player.id}"
      value="player-vote-id-${player.id}"
    />
    <label for="player-vote-id-${player.id}">${player.pmpname}</label>
  </div>`
    )
    .join("");
}

function renderScoreboard(scoreboard) {
  document.querySelector("#scoreboard").innerHTML = scoreboard
    .map(
      (
        playerScoreboard
      ) => `<p class="bg-primary rounded w-auto p-10" id="player-scoreboard-${playerScoreboard.id}">
    ${playerScoreboard.name} - ${playerScoreboard.score}
  </p>`
    )
    .join("");
}

function casteVote() {
  if (!document.querySelector("input[name='voting-radio']:checked")) return;

  const myVote = document.querySelector(
    "input[name='voting-radio']:checked"
  ).value;
  makeLoaderVisible(true);
  socket.emit("casteVote", myVote.split("player-vote-id-")[1]);
}

function revealSongOwner() {
  if (Object.entries(room.voting).length !== playerList.length) {
    toastTopAlert(
      "Insufficient Votes",
      "Please ask everyone to caste their votes first.",
      "alert-danger"
    );
    return;
  }
  makeLoaderVisible(true);
  socket.emit("revealSongOwner");
}

socket.on("nextRound", (data) => {
  makeLoaderVisible(false);
  renderGamePage();
  resetForNextRound(data);
});

socket.on("revealSongOwner", (data) => {
  const { ownerId, ownerName } = data;
  makeLoaderVisible(false);

  document.querySelector("#current-song-owner").classList.remove("d-none");
  document.querySelector("#current-song-owner").classList.add("d-flex");
  document.querySelector(
    "#current-song-owner"
  ).innerHTML = `Song Owner: ${ownerName}`;
  if (my.isOwner) {
    document.querySelector("#reveal-song-owner").disabled = true;
    document.querySelector("#next-round").disabled = false;
  }
  Array.from(document.querySelectorAll(`.voted-to-${ownerId}`)).forEach(
    (votedEle) => {
      if (votedEle.classList.contains("bg-secondary"))
        votedEle.classList.remove("bg-secondary");
      if (votedEle.classList.contains("bg-danger"))
        votedEle.classList.remove("bg-danger");
      votedEle.classList.add("bg-success");
    }
  );
});

socket.on("updatedVotes", (voting) => {
  makeLoaderVisible(false);
  room.voting = voting;
  renderOtherPlayersVotes(voting);
});

socket.on("updatedScoreboard", (scoreboard) => {
  makeLoaderVisible(false);
  renderScoreboard(scoreboard);
});

function resetForNextRound(data) {
  const { song, songsLeft } = data;
  document.querySelector("#songs-left").innerHTML = `Songs: ${songsLeft}`;
  document.querySelector("#current-song-owner").innerHTML = "";
  document.querySelector("#current-song-owner").classList.remove("d-flex");
  document.querySelector("#current-song-owner").classList.add("d-none");

  document.querySelector("#current-song-link").value = song;

  document.querySelector("#next-round").disabled = true;
  if (my.isOwner) document.querySelector("#reveal-song-owner").disabled = false;
  room.voting = {};
  if (document.querySelector("input[name='voting-radio']:checked"))
    document.querySelector(
      "input[name='voting-radio']:checked"
    ).checked = false;
  renderOtherPlayersVotes(
    Object.fromEntries(playerList.map((player) => [player.id, null]))
  );

  if (songsLeft === 0) {
    document.querySelector("#next-round").disabled = true;
    document.querySelector("#next-round").classList.remove("btn-secondary");
    document.querySelector("#next-round").innerHTML =
      "Game Over, no songs left...";
  }
}
