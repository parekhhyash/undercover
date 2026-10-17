const pool = require("../config/db");
const generateCode = require("../utils/generateCode");

exports.createRoom = async (req, res) => {
  try {
    const { hostName } = req.body;

    if (!hostName) {
      return res.status(400).json({ message: "Host name required" });
    }

    let roomCode;
    let existingRoom;

    // Ensure unique room code
    do {
      roomCode = generateCode();
      const check = await pool.query(
        "SELECT * FROM rooms WHERE room_code = $1",
        [roomCode]
      );
      existingRoom = check.rows.length > 0;
    } while (existingRoom);

    // Insert room
    const roomResult = await pool.query(
      "INSERT INTO rooms (room_code, host_name) VALUES ($1, $2) RETURNING *",
      [roomCode, hostName]
    );

    const room = roomResult.rows[0];

    // Insert host as first player
    await pool.query(
      "INSERT INTO players (room_id, name) VALUES ($1, $2)",
      [room.id, hostName]
    );

    res.status(201).json({
      roomCode: room.room_code,
      host: room.host_name,
      status: room.status,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
