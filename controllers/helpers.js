function getPlayersCount(roomID) {
  return Object.keys(games[roomID]).filter((key) => key.length === 20).length;
}

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  getPlayersCount,
  randomIntFromInterval,
};
