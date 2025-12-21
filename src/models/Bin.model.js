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
            unique: true
        },

        status: {
            type: String,
            enum: ["OPEN", "CLOSED"],
            default: "CLOSED"
        },

        level: {
            type: Number, // 0 to 100
            default: 0
        },
        lastActionAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Bin = mongoose.model("Bin", binSchema);

export default Bin;
