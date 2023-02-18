const { readFileSync } = require("fs");
const Chance = require("chance");

const chance = new Chance();
// const words = JSON.parse(readFileSync('words.json').toString('utf-8'));
const words = {};

function getPlayersCount(roomID) {
  return Object.keys(games[roomID]).filter((key) => key.length === 20).length;
}

function get3Words() {
  const topic = "bollywood";
  return chance.pickset(words[topic], 3);
}

function getScore(startTime, roundtime) {
  const now = Date.now() / 1000;
  const elapsedTime = now - startTime;
  const roundTime = roundtime / 1000;
  return Math.floor(((roundTime - elapsedTime) / roundTime) * MAX_POINTS);
}

function wait(roomID, drawer, ms) {
  return new Promise((resolve, reject) => {
    round.on("everybodyGuessed", ({ roomID: callerRoomID }) => {
      if (callerRoomID === roomID) resolve();
    });
    drawer.on("disconnect", (err) => reject(err));
    setTimeout(() => resolve(true), ms);
  });
}

module.exports = {
  getPlayersCount,
  get3Words,
  getScore,
  wait,
};
