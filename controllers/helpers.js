function getPlayersCount(roomID) {
  return Object.entries(games[roomID]["players"]).length;
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  getPlayersCount,
  randomIntFromInterval,
};
