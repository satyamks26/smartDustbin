import Bin from "../models/Bin.model.js";

/*
  GET /bin/:binId
*/
export const visitBin = async (req, res) => {
    try {
        const { binId } = req.params;

        let bin = await Bin.findOne({ binId });

        if (!bin) {
            bin = await Bin.create({ binId });
        }

        res.json(bin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/*
  POST /bin/:binId/open
*/
export const openBin = async (req, res) => {
    try {
        const { binId } = req.params;

        const bin = await Bin.findOneAndUpdate(
            { binId },
            {
                command: "OPEN",
                status: "OPEN",
                lastActionAt: new Date(),
            },
            { new: true, upsert: true }
        );

        res.json({
            ok: true,
            command: bin.command,
        });
    } catch (err) {
        console.error("OPEN ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

/*
  POST /bin/:binId/close
*/
export const closeBin = async (req, res) => {
    try {
        const { binId } = req.params;

        const bin = await Bin.findOneAndUpdate(
            { binId },
            {
                command: "CLOSE",
                status: "CLOSED",
                lastActionAt: new Date(),
            },
            { new: true, upsert: true }
        );

        res.json({
            ok: true,
            command: bin.command,
        });
    } catch (err) {
        console.error("CLOSE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};
