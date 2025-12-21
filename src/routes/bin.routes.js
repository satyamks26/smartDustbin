import express from "express";
import {
  visitBin,
  openBin,
  closeBin
} from "../controllers/bin.controller.js";

const router = express.Router();

router.get("/:binId", visitBin);
router.post("/:binId/open", openBin);
router.post("/:binId/close", closeBin);

export default router;
