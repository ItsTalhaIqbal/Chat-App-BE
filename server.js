import express from "express";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT;
const app = express();

app.get("/", (req, res) => {
  res.send("app is running");
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
