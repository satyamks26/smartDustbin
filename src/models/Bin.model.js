import mongoose from "mongoose";

/*
  Represents a physical dustbin.
  binId comes from QR code (e.g. BIN_01)
*/
const binSchema = new mongoose.Schema(
    {
        binId: {
            type: String,
            required: true,
            unique: true,
        },

        // Actual physical state of bin
        status: {
            type: String,
            enum: ["OPEN", "CLOSED"],
            default: "CLOSED",
        },

        // Command for ESP (what ESP should do)
        command: {
            type: String,
            enum: ["OPEN", "CLOSE"],
            default: "CLOSE",
        },

        // Fill level from sensor (0–100)
        level: {
            type: Number,
            default: 0,
        },

        // Last time bin was opened/closed
        lastActionAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Bin = mongoose.model("Bin", binSchema);

export default Bin;
