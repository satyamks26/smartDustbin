import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

/*
  Connect to MongoDB.
  We start the server ONLY after DB is connected.
*/
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        const server = app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });

        // Graceful shutdown logic
        const shutdown = () => {
            console.log("Shutting down server...");
            server.close(() => {
                console.log("Server closed");
                process.exit(0);
            });
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
    })
    .catch(err => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });
