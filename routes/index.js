const express = require("express");
const fs = require("fs").promises;
const router = express.Router();
const env = require("env2")(__dirname + "./../.env");
const path = require("path");
const config = require(__dirname + "./../config");

const players = config.players;
const admin = config.admin;

const getPlayers = async () => {
  const players = await fs.readFile(__dirname + "/../data.json");
  return JSON.parse(players);
};

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/admin-request", (req, res) => {
  res.render("admin", { verified: false });
});

router.get("/admin", (req, res) => {
  setTimeout(() => {
    return res.render("admin", { verified: true });
  }, 3000);
});

router.post("/sign-up", async (req, res) => {
  if (req.body.secret !== process.env.SECRET) {
    res.render("index", { secretError: true });
  }
  const completed = await getPlayers();
  const completedNames = completed.map((item) => item.name);

  const unsubmitted = players.filter((player) => {
    return !completedNames.find((complete) => {
      return complete == player;
    });
  });
  if (unsubmitted.length < 1) {
    return res.render("hold");
  }
  res.render("signup", { players: unsubmitted });
});

router.post("/submit", async (req, res) => {
  const players = await getPlayers();
  players.push(req.body);
  await fs.writeFile("data.json", JSON.stringify(players));
  res.render("index");
});

module.exports = router;
