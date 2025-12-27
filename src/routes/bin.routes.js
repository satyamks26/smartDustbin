import express from "express";
import {
  visitBin,
  openBin,
  closeBin,
} from "../controllers/bin.controller.js";
import Bin from "../models/Bin.model.js";

const router = express.Router();

/*
  USER / DASHBOARD
  QR scan entry
  GET /bin/BIN_01
*/
router.get("/:binId", visitBin);

/*
  FRONTEND BUTTONS
  POST /bin/BIN_01/open
  POST /bin/BIN_01/close
*/
router.post("/:binId/open", openBin);
router.post("/:binId/close", closeBin);

/*
  ESP8266 COMMAND API
  ESP will poll this
  GET /bin/BIN_01/command
*/
router.get("/:binId/command", async (req, res) => {
  try {
    const { binId } = req.params;

    const bin = await Bin.findOne({ binId });

    if (!bin) {
      return res.status(404).json({ message: "Bin not found" });
    }

    res.json({
      command: bin.command || "CLOSE",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
