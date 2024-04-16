import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connectMongoDB } from "./lib/mongo.js";
import authRouter from "./routes/auth.js";
import testRouter from "./routes/testauth.js";
import AIRouter from "./routes/chatgpt.js";
import DesRouter from "./routes/topDes.js";
import postRouter from "./routes/post.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectMongoDB();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send(`Hello this is the server on Port ${PORT}`);
});

app.use("/auth", authRouter);
app.use("/test", testRouter);
app.use("/ai", AIRouter);
app.use("/top", DesRouter);
app.use("/post", postRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
