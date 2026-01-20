import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/Auth.route.js";
import connectdb from "./config/db.config,.js";
import cookieParser from "cookie-parser";

//configurations
const app = express();
dotenv.config();
const port = process.env.PORT;
connectdb();

// middlewares
app.use(express.json());
app.use(cookieParser());

//routes
app.get("/", (req, res) => {
  res.send("app is running");
});
app.use("/api/auth", authRoutes);

//server
app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
