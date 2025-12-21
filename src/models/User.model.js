import mongoose from "mongoose";

/*
  This model represents a person who scanned the QR code.
  No email, no password.
  Identity is stored in browser (localStorage).
*/
const userSchema = new mongoose.Schema(
    {
        displayName: {
            type: String,
            required: true
        },

        points: {
            type: Number,
            default: 5 // new user starts with 5 points
        },
        lastScanAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true // adds createdAt & updatedAt
    }
);

const User = mongoose.model("User", userSchema);

export default User;
