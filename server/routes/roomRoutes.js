const express = require("express");
const router = express.Router();
const { createRoom } = require("../controllers/roomController");

router.post("/", createRoom);

router.get("/", (req, res) => {
  res.send("hello mf");
});


module.exports = router;
