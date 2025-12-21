import User from "../models/User.model.js";
import Bin from "../models/Bin.model.js";

/*
  This function handles:
  - new user creation
  - points increment
  - bin creation
  - returning dashboard data
*/
export const visitBin = async (req, res) => {
    try {
        const { binId } = req.params;

        /*
          userId is sent from frontend.
          First time → it will be undefined.
        */
        let { userId } = req.query;

        let user;

        // 1️⃣ If user does NOT exist → create one
        if (!userId) {
            user = await User.create({
                displayName: `User-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
            });
        }
        // 2️⃣ If userId exists → fetch user
        else {
            user = await User.findById(userId);

            /*
              Edge case:
              userId exists in browser but user was deleted from DB
            */
            if (!user) {
                user = await User.create({
                    displayName: `User-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
                });
            } else {
                // Add points on every visit
                const now = new Date();
                const COOLDOWN = 5 * 60 * 1000; // 5 minutes

                if (!user.lastScanAt || now - user.lastScanAt > COOLDOWN) {
                    user.points += 5;
                    user.lastScanAt = now;
                    await user.save();
                }

            }
        }

        // 3️⃣ Find or create bin
        let bin = await Bin.findOne({ binId });

        if (!bin) {
            bin = await Bin.create({ binId });
        }

        // 4️⃣ Send dashboard data
        res.json({
            user: {
                id: user._id,
                name: user.displayName,
                points: user.points
            },
            bin: {
                id: bin.binId,
                status: bin.status,
                level: bin.level
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

/*
  Open the dustbin
*/
export const openBin = async (req, res) => {
    try {
        const { binId } = req.params;

        // Find the bin
        const bin = await Bin.findOne({ binId });

        if (!bin) {
            return res.status(404).json({ message: "Bin not found" });
        }

        const now = new Date();
        const ACTION_COOLDOWN = 10 * 1000; // 10 seconds

        // Prevent rapid open/close spam
        if (bin.lastActionAt && now - bin.lastActionAt < ACTION_COOLDOWN) {
            return res.status(429).json({
                message: "Action too frequent. Please wait before trying again."
            });
        }

        // Change bin state
        bin.status = "OPEN";
        bin.lastActionAt = now;

        await bin.save();

        res.json({
            message: "Bin opened successfully",
            status: bin.status
        });

    } catch (error) {
        console.error("Open bin error:", error);
        res.status(500).json({ message: "Failed to open bin" });
    }
};

/*
  Close the dustbin
*/
export const closeBin = async (req, res) => {
    try {
        const { binId } = req.params;

        // Find the bin
        const bin = await Bin.findOne({ binId });

        if (!bin) {
            return res.status(404).json({ message: "Bin not found" });
        }

        const now = new Date();
        const ACTION_COOLDOWN = 10 * 1000; // 10 seconds

        // Prevent rapid open/close spam
        if (bin.lastActionAt && now - bin.lastActionAt < ACTION_COOLDOWN) {
            return res.status(429).json({
                message: "Action too frequent. Please wait before trying again."
            });
        }

        // Change bin state
        bin.status = "CLOSED";
        bin.lastActionAt = now;

        await bin.save();

        res.json({
            message: "Bin closed successfully",
            status: bin.status
        });

    } catch (error) {
        console.error("Close bin error:", error);
        res.status(500).json({ message: "Failed to close bin" });
    }
};
