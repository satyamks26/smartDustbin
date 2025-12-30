import Bin from "../models/Bin.model.js";
import User from "../models/User.model.js";

export async function visitBin(req, res) {
    const { binId } = req.params;
    const { userId } = req.query;

    let bin = await Bin.findOne({ binId });
    if (!bin) {
        bin = await Bin.create({ binId });
    }

    let user;

    if (userId) {
        user = await User.findById(userId);
    }

    if (!user) {
        user = await User.create({
            displayName: "User_" + Math.floor(Math.random() * 10000),
            points: 5
        });
    }

    res.json({ bin, user });
}

export async function openBin(req, res) {
    const { binId } = req.params;
    const { userId } = req.query;

    const bin = await Bin.findOneAndUpdate(
        { binId },
        { status: "OPEN", command: "OPEN", lastActionAt: new Date() },
        { new: true }
    );

    if (userId) {
        await User.findByIdAndUpdate(userId, {
            $inc: { points: 5 }
        });
    }

    res.json({ ok: true });
}

export async function closeBin(req, res) {
    const { binId } = req.params;
    const { userId } = req.query;

    const bin = await Bin.findOneAndUpdate(
        { binId },
        { status: "CLOSED", command: "CLOSE", lastActionAt: new Date() },
        { new: true }
    );

    res.json({ ok: true });
}
