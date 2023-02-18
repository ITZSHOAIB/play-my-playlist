/************************************************
 ***Landing Page Code Section --------------------
 *************************************************/

window.onload = () => {
  if (localStorage.getItem("pmpname"))
    nameInputL.value = localStorage.getItem("pmpname");
};

const joinRoomBtnL = document.querySelector("#join-room");
const createRoomBtnL = document.querySelector("#create-room");
const nameInputL = document.querySelector("#name-landing-input");
const params = window.location
  .toString()
  .substring(window.location.toString().indexOf("?"));
const searchParams = new URLSearchParams(params);
const landingPage = document.querySelector("#landing");
const settingsPage = document.querySelector("#settings");

//new player or joinee
if (searchParams.has("id")) {
  room.roomId = searchParams.get("id");
  socket.emit("roomExists", { id: room.roomId });
  socket.on("roomExists", (data) => {
    if (!data.exist) window.location.href = "/";
  });
  joinRoomBtnL.addEventListener("click", () => {
    if (landingToSettings()) settingsAsPlayer();
  });
} else {
  createRoomBtnL.addEventListener("click", () => {
    if (landingToSettings()) settingsAsOwner();
  });
}
function landingToSettings() {
  if (nameInputL.value.trim() === "") {
    toastTopAlert(
      "Missing Data :(",
      "Don't you have a name? Don't leave that box empty. Okay?",
      "alert-danger"
    );
    return false;
  }
  landingPage.remove();
  settingsPage.classList.remove("d-none");
  settingsPage.classList.add("d-flex");
  localStorage.setItem("pmpname", nameInputL.value.trim());
  my.pmpname = nameInputL.value.trim();
  return true;
}
