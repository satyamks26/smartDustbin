import express from "express";
import cors from "cors";
import binRoutes from "./routes/bin.routes.js";


const app = express();

/*
  Parse incoming JSON bodies.
  Required because frontend will send data as JSON.
*/
app.use(express.json());

/*
  Allow requests from any frontend for now.
  Later we can restrict origins if needed.
*/
app.use(cors());

app.use("/bin", binRoutes);


export default app;
