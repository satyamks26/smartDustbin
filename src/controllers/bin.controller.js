import mongoose from "mongoose";
import Bin from "../models/Bin.model.js";
import User from "../models/User.model.js";
import { openServo, closeServo } from "../hardware/arduino.js";

/**
 * GET /bin/:binId
 * Called when QR is scanned or page is opened
 */
export async function visitBin(req, res) {
    console.log("🔥 visitBin controller HIT");

    try {
        const { binId } = req.params;
        const { userId } = req.query;

        let user;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            // create new user
            user = await User.create({
                displayName: `User_${Math.floor(Math.random() * 10000)}`,
                points: 5,
            });
        } else {
            user = await User.findById(userId);
            if (user) {
                user.points += 5;
                await user.save();
            } else {
                // If ID was valid but user not found, create new
                user = await User.create({
                    displayName: `User_${Math.floor(Math.random() * 10000)}`,
                    points: 5,
                });
            }
        }

        let bin = await Bin.findOne({ binId });

        if (!bin) {
            bin = await Bin.create({
                binId,
                status: "CLOSED",
                level: 0,
                lastActionAt: null,
            });
        }

        res.json({ user, bin });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load bin" });
    }
}

/**
 * POST /bin/:binId/open
 * Open bin + rotate servo
 */
export async function openBin(req, res) {
    try {
        const { binId } = req.params;

        const bin = await Bin.findOne({ binId });
        if (!bin) {
            return res.status(404).json({ error: "Bin not found" });
        }

        // Safety rule
        if (bin.status === "OPEN") {
            return res.json({ message: "Bin already open" });
        }

        // 🔌 HARDWARE CALL
        console.log("🔥 Calling openServo()");

        openServo();

        bin.status = "OPEN";
        bin.lastActionAt = new Date();
        await bin.save();

        res.json({
            message: "Bin opened",
            status: bin.status,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to open bin" });
    }
}

/**
 * POST /bin/:binId/close
 * Close bin + rotate servo
 */
export async function closeBin(req, res) {
    try {
        const { binId } = req.params;

        const bin = await Bin.findOne({ binId });
        if (!bin) {
            return res.status(404).json({ error: "Bin not found" });
        }

        if (bin.status === "CLOSED") {
            return res.json({ message: "Bin already closed" });
        }

        // 🔌 HARDWARE CALL
        closeServo();

        bin.status = "CLOSED";
        bin.lastActionAt = new Date();
        await bin.save();

        res.json({
            message: "Bin closed",
            status: bin.status,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to close bin" });
    }
}
